import type { NextApiRequest, NextApiResponse } from 'next';
import {
  GameSearchResult,
  getGameArtwork,
} from '../../libs/imageSearch';

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
    const rawgResponse = await fetch(
      `https://api.rawg.io/api/games?key=${encodeURIComponent(
        process.env.RAWG_API_KEY
      )}&search=${encodeURIComponent(name)}&page_size=5`
    );
    if (!rawgResponse.ok) throw new Error('RAWG request failed');

    const image = getGameArtwork(
      (await rawgResponse.json()) as GameSearchResult,
      name
    );
    response.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate');
    response.status(200).json({ image: image || null });
  } catch (error) {
    response.status(502).json({ image: null });
  }
}
