import { get as httpsGet } from 'https';
import type { NextApiRequest, NextApiResponse } from 'next';

const sharp: typeof import('sharp') = require('sharp');

const cardWidth = 1200;
const cardHeight = 630;
const maxImageBytes = 10 * 1024 * 1024;
const shareListLogo = Buffer.from(
  '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',
  'base64'
);
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
    const background = Buffer.from(`
      <svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${cardWidth}" height="${cardHeight}" fill="#143757"/>
        <circle cx="1050" cy="90" r="250" fill="#1d4d73"/>
        <circle cx="110" cy="610" r="260" fill="#0d2a44"/>
      </svg>
    `);
    const logo = await sharp(shareListLogo)
      .resize({ width: 760 })
      .png()
      .toBuffer();

    return sharp(background)
      .composite([{ input: logo, left: 220, top: 208 }])
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
