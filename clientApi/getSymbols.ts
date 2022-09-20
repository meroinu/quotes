import axios from 'axios';
import { FMFWSymbols, Symbols } from '../types/quotes';

export async function getSymbols(): Promise<Symbols> {
  /** Get tickers for the snapshot tickers data */
  const { data: symbolsResponse } = await axios.get<FMFWSymbols>('api/symbols');
  const symbols: Symbols = {};

  for (const symbol of Object.entries(symbolsResponse)) {
    const [symbolName, { base_currency: base, quote_currency: quote }] = symbol;
    const displayName =
      base && quote ? `${base} / ${quote}` : symbolName.replace('_', ' / ');
    symbols[symbolName] = {
      displayName,
    };
  }

  return symbols;
}
