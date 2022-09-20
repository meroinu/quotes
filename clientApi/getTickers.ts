import axios from 'axios';
import { Tickers, FMFWTickersSnapshot, FMFWSymbols } from '../types/quotes';

export async function getTickers(): Promise<Tickers> {
  /** Get tickers for the snapshot tickers data */
  const { data: tickersSnapshot } = await axios.get<FMFWTickersSnapshot>(
    'api/tickers'
  );
  const tickers: Tickers = {};

  /** Add only needed data */
  for (const ticker of Object.entries(tickersSnapshot)) {
    const [tickerSymbol, { ask, bid, high, low, last }] = ticker;
    tickers[tickerSymbol] = {
      ask,
      bid,
      high,
      low,
      last,
    };
  }

  return tickers;
}
