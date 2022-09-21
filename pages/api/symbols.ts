import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FMFWSymbols } from '../../types/quotes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FMFWSymbols>
) {
  try {
    const { data: symbols } = await axios.get<FMFWSymbols>(
      'https://api.fmfw.io/api/3/public/symbol'
    );

    res.status(200).json(symbols);
  } catch (e: unknown) {
    res.status(500).json({});
  }
}
