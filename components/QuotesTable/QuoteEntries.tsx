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
  symbols: Symbols;
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
  const { [criteria]: aValue } = aTicker;
  const { [criteria]: bValue } = bTicker;

  const isNumeric = !isNaN(Number(aValue)) && !isNaN(Number(bValue));
  const isDESC = order === OrderType.DESC;

  let a: string;
  let b: string;

  /** local compare behaves differently for strings and numbers, so */
  if (isNumeric) {
    a = (isDESC ? aValue : bValue) || '';
    b = (isDESC ? bValue : aValue) || '';
  } else {
    a = (isDESC ? bValue : aValue) || '';
    b = (isDESC ? aValue : bValue) || '';
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
  const { tickers, symbols, filter, limit } = opts;

  if (!tickers) {
    return [];
  }

  const { criteria, order } = filter;

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

  return Number(current) < Number(previous) ? QuoteEntryUpdateType.Down : QuoteEntryUpdateType.Up;
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
              const updateType = getEntryUpdateType(currentValue, previousValue);

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
