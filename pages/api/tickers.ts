import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FMFWSymbols, FMFWTickersSnapshot } from '../../types/quotes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FMFWTickersSnapshot>
) {
  const { data: tickersSnapshot } = await axios.get<FMFWTickersSnapshot>(
    'https://api.fmfw.io/api/3/public/ticker'
  );

  res.status(200).json(tickersSnapshot);
}
