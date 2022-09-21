import {
  OrderType,
  QuoteEntryUpdateType,
  QuotesTableColumn,
  Symbols,
  TickerData,
  Tickers,
  TickersListItem,
} from '../../types/quotes';
import { TickerColumnEntry } from './QuoteColumnEntry';
import { themes, ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

type Props = {
  tickers: Tickers;
  previousTickersState: Tickers;
  symbols: Symbols | null;
  columns: QuotesTableColumn[];
  filterCriteria: QuotesTableColumn;
  order: OrderType;
  limit?: number; // if undefined then show all
};

const tickersListSortHandler = ({
  aTicker,
  bTicker,
  criteria,
  order,
}: {
  aTicker: TickersListItem;
  bTicker: TickersListItem;
  criteria: QuotesTableColumn;
  order: OrderType;
}) => {
  const { [criteria]: aTickerValue } = aTicker;
  const { [criteria]: bTickerValue } = bTicker;

  const isNumeric =
    !isNaN(Number(aTickerValue)) || !isNaN(Number(bTickerValue));
  const isDESC = order === OrderType.DESC;

  /** Typical naming for comparison functions */
  let a: string;
  let b: string;

  /** local compare behaves differently for strings and numbers, so.
   * a = bTickerValue and b = aTickerValue if only one (ONE) of the conditions is true (isNumeric or isDESC),
   * otherwise a = aTickerValue and b = bTickerValue.
   * Twisted logic but... well, it's working :(
   */
  if ((isNumeric || isDESC) && !(isNumeric && isDESC)) {
    a = bTickerValue || '';
    b = aTickerValue || '';
  } else {
    a = aTickerValue || '';
    b = bTickerValue || '';
  }

  return b.localeCompare(a, undefined, { numeric: isNumeric });
};

/** Get formatted tickers list to display */
const getTickersList = (opts: {
  tickers: Tickers | null;
  symbols: Symbols | null;
  filter: {
    criteria: QuotesTableColumn;
    order: OrderType;
  };
  limit?: number;
}): TickersListItem[] => {
  const {
    tickers,
    symbols,
    filter: { criteria, order },
    limit,
  } = opts;

  if (!tickers) {
    return [];
  }

  /** Object with full tickers data */
  let tickersList = Object.entries(tickers).map(([symbol, tickerData]) => ({
    ticker: symbols?.[symbol]?.displayName || symbol,
    symbol,
    ...tickerData,
  }));

  /** Get top <limit> only by last */
  if (typeof limit === 'number') {
    tickersList = tickersList
      .sort((aTicker, bTicker) => {
        return tickersListSortHandler({
          aTicker,
          bTicker,
          order: OrderType.DESC,
          criteria: 'last',
        });
      })
      .slice(0, limit);
  }

  /** Sort by given criteria and given order */
  tickersList = tickersList.sort((aTicker, bTicker) => {
    return tickersListSortHandler({ aTicker, bTicker, order, criteria });
  });

  return tickersList;
};

/** Increased or decreased value */
const getEntryUpdateType = (
  current: string | null,
  previous?: string | null
): QuoteEntryUpdateType | undefined => {
  const currentNumber = Number(current);
  const previousNumber = Number(previous);
  const notNumbers = isNaN(currentNumber) || isNaN(previousNumber);

  if (current === previous || notNumbers) {
    return;
  }

  return Number(current) < Number(previous)
    ? QuoteEntryUpdateType.Down
    : QuoteEntryUpdateType.Up;
};

export const QuoteEntries = ({
  tickers,
  symbols,
  previousTickersState,
  columns,
  filterCriteria,
  order,
  limit,
}: Props): JSX.Element => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      {getTickersList({
        tickers,
        symbols,
        filter: { criteria: filterCriteria, order },
        limit,
      }).map((tickerEntry) => {
        const { ticker, symbol } = tickerEntry;
        return (
          <tr key={`${ticker}-row`}>
            {columns.map((column) => {
              const currentValue = tickerEntry[column];
              const previousValue =
                previousTickersState?.[symbol]?.[column as keyof TickerData];
              const updateType = getEntryUpdateType(
                currentValue,
                previousValue
              );

              return (
                <TickerColumnEntry
                  key={`${ticker}-${column}-entry`}
                  value={tickerEntry[column]}
                  updateType={updateType}
                />
              );
            })}
          </tr>
        );
      })}

      <style jsx>{`
        tr:nth-child(odd) {
          background: ${themes[theme].colors.table.rowDark};
        }
        tr:nth-child(even) {
          background: ${themes[theme].colors.table.rowLight};
        }
      `}</style>
    </>
  );
};
