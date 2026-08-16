import { get as httpsGet } from 'https';
import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

const cardWidth = 1200;
const cardHeight = 630;
const maxImageBytes = 10 * 1024 * 1024;
const allowedImageHosts = new Set([
  'd2k4q26owzy373.cloudfront.net',
  'image.tmdb.org',
]);

interface CollagePosition {
  width: number;
  height: number;
  left: number;
  top: number;
}

export function getCollageLayout(imageCount: number): CollagePosition[] {
  if (imageCount <= 1) {
    return [{ width: cardWidth, height: cardHeight, left: 0, top: 0 }];
  }

  if (imageCount === 2) {
    return [
      { width: 600, height: cardHeight, left: 0, top: 0 },
      { width: 600, height: cardHeight, left: 600, top: 0 },
    ];
  }

  if (imageCount === 3) {
    return [
      { width: 600, height: cardHeight, left: 0, top: 0 },
      { width: 600, height: 315, left: 600, top: 0 },
      { width: 600, height: 315, left: 600, top: 315 },
    ];
  }

  return [
    { width: 600, height: 315, left: 0, top: 0 },
    { width: 600, height: 315, left: 600, top: 0 },
    { width: 600, height: 315, left: 0, top: 315 },
    { width: 600, height: 315, left: 600, top: 315 },
  ];
}

function validateImageUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !allowedImageHosts.has(url.hostname)) {
    throw new Error('Unsupported image URL');
  }
  return url;
}

function downloadImage(url: URL, redirectsLeft = 2): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const request = httpsGet(url, (response) => {
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location &&
        redirectsLeft > 0
      ) {
        response.resume();
        try {
          const redirectUrl = validateImageUrl(
            new URL(response.headers.location, url).toString()
          );
          resolve(downloadImage(redirectUrl, redirectsLeft - 1));
        } catch (error) {
          reject(error);
        }
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Image request failed with ${response.statusCode}`));
        return;
      }

      const chunks: Buffer[] = [];
      let size = 0;
      response.on('data', (chunk: Buffer) => {
        size += chunk.length;
        if (size > maxImageBytes) {
          request.destroy(new Error('Image is too large'));
          return;
        }
        chunks.push(chunk);
      });
      response.on('end', () => resolve(Buffer.concat(chunks)));
    });

    request.setTimeout(5000, () =>
      request.destroy(new Error('Image timed out'))
    );
    request.on('error', reject);
  });
}

export async function createSocialCard(images: Buffer[]): Promise<Buffer> {
  if (!images.length) {
    const fallback = Buffer.from(`
      <svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${cardWidth}" height="${cardHeight}" fill="#143757"/>
        <circle cx="1050" cy="90" r="250" fill="#1d4d73"/>
        <circle cx="110" cy="610" r="260" fill="#0d2a44"/>
        <text x="600" y="285" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="112" font-weight="700">ShareList</text>
        <text x="600" y="390" text-anchor="middle" fill="#dce9f3" font-family="Arial, Helvetica, sans-serif" font-size="42">Open this shared list &#8594;</text>
      </svg>
    `);

    return sharp(fallback)
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();
  }

  const positions = getCollageLayout(images.length);
  const tiles = await Promise.all(
    images.map((image, index) => {
      const position = positions[index];
      return sharp(image)
        .resize(position.width, position.height, { fit: 'cover' })
        .jpeg({ quality: 84 })
        .toBuffer();
    })
  );

  return sharp({
    create: {
      width: cardWidth,
      height: cardHeight,
      channels: 3,
      background: '#f6f7fb',
    },
  })
    .composite(
      tiles.map((input, index) => ({
        input,
        left: positions[index].left,
        top: positions[index].top,
      }))
    )
    .jpeg({ quality: 86, progressive: true })
    .toBuffer();
}

export default async function socialCard(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const requestedImages = Array.isArray(request.query.image)
    ? request.query.image
    : request.query.image
    ? [request.query.image]
    : [];

  try {
    const imageUrls = requestedImages.slice(0, 4).map(validateImageUrl);
    const downloadedImages = await Promise.all(imageUrls.map(downloadImage));
    const card = await createSocialCard(downloadedImages);

    response.setHeader('Content-Type', 'image/jpeg');
    response.setHeader(
      'Cache-Control',
      'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800'
    );
    response.status(200).send(card);
  } catch (error) {
    response.status(400).json({ error: 'Unable to create social card' });
  }
}
