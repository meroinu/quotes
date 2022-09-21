import axios from 'axios';
import { Tickers, FMFWTickersSnapshot, FMFWSymbols } from '../types/quotes';

export async function getTickers(): Promise<Tickers | null> {
  try {
    const tickers: Tickers = {};

    /** Get tickers for the snapshot tickers data */
    const { data: tickersSnapshot } = await axios.get<FMFWTickersSnapshot>(
      'api/tickers'
    );

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
  } catch (e: unknown) {
    // some logging and other stuff here
    // if fetch tickers failed, successful socket subscribtion will get them anyway
  }

  return null;
}
