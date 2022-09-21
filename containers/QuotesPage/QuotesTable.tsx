import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { getTickers } from '../../clientApi/getTickers';
import { getSymbols } from '../../clientApi/getSymbols';
import {
  FMFWSocketErrorMsg,
  FMFWSocketMsg,
  FMFWSocketTickerMsgData,
  FMFWSuccessSocketMsg,
  OrderType,
  QuotesTableColumn,
  Symbols,
  Tickers,
} from '../../types/quotes';

import { QuoteTableColumnTitle } from '../../components/QuotesTable/QuoteTableColumnTitle';
import { COLUMNS } from '../../components/QuotesTable/constants';
import { usePrevious } from '../../hooks/usePrevious';
import { QuoteEntries } from '../../components/QuotesTable/QuoteEntries';

type Props = {
  limit?: number;
};

const handleSocketTickerMsgData = (msgData: FMFWSocketTickerMsgData) => {
  if (!msgData) {
    return {};
  }

  const updatedTickers: Tickers = {};

  for (const tickerData of Object.entries(msgData)) {
    const [symbol, { h: high, l: low, a: ask, b: bid, c: last }] = tickerData;

    updatedTickers[symbol] = {
      ask,
      bid,
      high,
      low,
      last,
    };
  }

  return updatedTickers;
};

export const QuotesTable = ({ limit }: Props): JSX.Element => {
  const [tickers, setTickers] = useState<Tickers | null>(null);
  const [symbols, setSymbols] = useState<Symbols | null>(null);

  const [filterCriteria, setFilterCriteria] =
    useState<QuotesTableColumn>('last');
  const [filterOrder, setFilterOrder] = useState<OrderType>(OrderType.DESC);

  /** Simple error handling */
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleChangeFilter = (
    criteria: QuotesTableColumn,
    order: OrderType
  ) => {
    if (criteria !== filterCriteria) {
      setFilterCriteria(criteria);
    } else if (order !== filterOrder) {
      setFilterOrder(order);
    }
  };

  /** Previous ref to compare values changes (increased/decreased) */
  const prevTickers = usePrevious(tickers);

  /** Need both (so 2 requests, but it seems ok in that case):
   * ticker for the snapshot to display all data,
   * symbols for pretty name (base/quote currencies).
   * */
  const fetchTickers = useCallback(async () => {
    try {
      const snapshot = await getTickers();
      setTickers(snapshot);
    } catch (e: unknown) {}
  }, []);

  const fetchSymbols = useCallback(async () => {
    const symbols = await getSymbols();
    setSymbols(symbols);
  }, []);

  /** Open websocket conenction */
  const { readyState, sendJsonMessage, lastJsonMessage } =
    useWebSocket<FMFWSocketMsg>('wss://api.fmfw.io/api/3/ws/public', {
      /** Simple reconnect (one time, just to demonstrate) */
      retryOnError: true,
      reconnectAttempts: 1,
      reconnectInterval: 1,
      onReconnectStop: () => {
        setLoading(false);
        setError(true);
      },
    });

  useEffect(() => {
    fetchTickers();
  }, [fetchTickers]);

  useEffect(() => {
    try {
      fetchSymbols();
    } catch (e: unknown) {
      setError(true);
    }
  }, [fetchSymbols]);

  /** Subscribe to batch updates */
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        method: 'subscribe',
        ch: 'ticker/1s/batch',
        /**
         * Some weird type bug in the socket hook
         * so ingore
         */
        // @ts-ignore
        params: {
          symbols: ['*'],
        },
        id: 123,
      });
    }
  }, [readyState, sendJsonMessage]);

  /** Update tickers on socket msg */
  useEffect(() => {
    if (lastJsonMessage) {
      const { error: msgError } = lastJsonMessage as FMFWSocketErrorMsg;
      const { data: msgData } = lastJsonMessage as FMFWSuccessSocketMsg;

      if (msgError) {
        setLoading(true);
      } else {
        const updatedTickers = handleSocketTickerMsgData(msgData);

        setTickers((prev) => ({ ...prev, ...updatedTickers }));
        setLoading(false);
      }
    }
  }, [lastJsonMessage]);

  return (
    <table cellSpacing="0" className="mono-font">
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <QuoteTableColumnTitle
              key={`column-${column}`}
              title={column}
              showOrderIcon={filterCriteria === column}
              filterOrder={filterOrder}
              onClick={handleChangeFilter}
            />
          ))}
        </tr>
      </thead>

      <tbody>
        {loading ? ( // waiting for data
          <tr>
            <td colSpan={COLUMNS.length}>
              ⏳ Please be kind and wait a little ⏳
            </td>
          </tr>
        ) : null}

        {error ? ( // error
          <tr>
            <td colSpan={COLUMNS.length}>
              So. Some error occured. Try reload the page. Sorry.
            </td>
          </tr>
        ) : null}

        {!error && tickers ? ( // data is ok
          <QuoteEntries
            columns={COLUMNS}
            tickers={tickers}
            previousTickersState={prevTickers as Tickers}
            symbols={symbols}
            filterCriteria={filterCriteria}
            order={filterOrder}
            limit={limit}
          />
        ) : null}
      </tbody>

      <style jsx>{`
        table {
          width: 1024px;
          text-transform: uppercase;
        }

        td {
          padding: 8px 16px;
          width: 16%;
          text-align: right;
        }

        td:first-child {
          text-align: left;
        }
      `}</style>
    </table>
  );
};
