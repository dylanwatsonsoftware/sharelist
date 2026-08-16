import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchRawgImage } from '../../libs/rawg';

export default async function gameImage(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const name = Array.isArray(request.query.name)
    ? request.query.name[0]
    : request.query.name;

  if (!name || !process.env.RAWG_API_KEY) {
    response.status(400).json({ image: null });
    return;
  }

  try {
    const image = await fetchRawgImage(name, process.env.RAWG_API_KEY);
    response.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate');
    response.status(200).json({ image: image || null });
  } catch (error) {
    response.status(502).json({ image: null });
  }
}
