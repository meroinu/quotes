import axios from 'axios';
import { FMFWSymbols, Symbols } from '../types/quotes';

export async function getSymbols(): Promise<Symbols | null> {
  try {
    /** Get tickers for the snapshot tickers data */
    const symbols: Symbols = {};
    const { data: symbolsResponse } = await axios.get<FMFWSymbols>(
      'api/symbols'
    );

    for (const symbol of Object.entries(symbolsResponse)) {
      const [symbolName, { base_currency: base, quote_currency: quote }] =
        symbol;
      const displayName =
        base && quote ? `${base} / ${quote}` : symbolName.replace('_', ' / ');
      symbols[symbolName] = {
        displayName,
      };
    }

    return symbols;
  } catch (e: unknown) {
    // some logging and other stuff here
    // if symbols failed gonna use ugly symbols (wothout /)
  }
  return null;
}
