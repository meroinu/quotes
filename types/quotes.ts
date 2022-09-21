// use partial FMFW ticker response as operational local type
// because it's pretty nice
export interface TickerData {
  ask: string | null;
  bid: string | null;
  last: string;
  low: string;
  high: string;
}

export type Tickers = {
  [symbol: string]: TickerData;
};

// Currently need only pretty display name
export type Symbols = {
  [symbol: string]: {
    displayName: string;
  };
};

export interface TickersListItem extends TickerData {
  ticker: string; // display name, the propetry is named as column title
  symbol: string; // original symbol
}

// full FMFW responses
export interface FMFWTickerData extends TickerData {
  open: string;
  volume: string;
  volume_quote: string;
  timestamp: string;
}

export type FMFWTickersSnapshot = {
  [symbol: string]: FMFWTickerData;
};

export type FMFWSymbol = {
  type: 'spot' | 'futures';
  base_currency: string;
  quote_currency: string;
  status: 'working' | 'suspended' | 'clearing';
  quantity_increment: string;
  tick_size: string;
  take_rate: string;
  make_rate: string;
  fee_currency: string;
  margin_trading: boolean;
  max_initial_leverage: string;
};

export type FMFWSymbols = {
  [symbol: string]: FMFWSymbol;
};

export type FMFWSocketTickerData = {
  t: number; // Timestamp in milliseconds
  a: string; // Best ask
  A: string; // Best ask quantity
  b: string; // Best bid
  B: string; // Best bid quantity
  c: string; // Last price
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Base asset volume
  q: string; // Quote asset volume
  p: string; // Price change
  P: string; // Price change percent
  L: number; // Last trade identifier
};

export type FMFWSocketTickerMsgData = {
  [symbol: string]: FMFWSocketTickerData;
};

export type FMFWSocketErrorMsg = {
  error: {
    code: number;
    message: string;
    description: string;
  };
};

export type FMFWSuccessSocketMsg = {
  data: FMFWSocketTickerMsgData;
};

export type FMFWSocketMsg = FMFWSocketErrorMsg | FMFWSuccessSocketMsg;

export type QuotesTableColumn =
  | 'ticker'
  | 'ask'
  | 'bid'
  | 'high'
  | 'low'
  | 'last';

export enum OrderType {
  DESC,
  ASC,
}

export enum QuoteEntryUpdateType {
  Up,
  Down,
}
