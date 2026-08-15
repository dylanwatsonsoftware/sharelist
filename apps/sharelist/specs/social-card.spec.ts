import sharp from 'sharp';
import { createSocialCard, getCollageLayout } from '../pages/api/social-card';

describe('social card collage', () => {
  it('lays out three images with one large tile and two smaller tiles', () => {
    expect(getCollageLayout(3)).toEqual([
      { width: 600, height: 630, left: 0, top: 0 },
      { width: 600, height: 315, left: 600, top: 0 },
      { width: 600, height: 315, left: 600, top: 315 },
    ]);
  });

  it('creates a 1200 by 630 JPEG from multiple images', async () => {
    const images = await Promise.all(
      ['#e56b6f', '#355070', '#6d597a'].map((background) =>
        sharp({
          create: { width: 20, height: 20, channels: 3, background },
        })
          .png()
          .toBuffer()
      )
    );

    const card = await createSocialCard(images);
    const metadata = await sharp(card).metadata();

    expect(metadata).toEqual(
      expect.objectContaining({ width: 1200, height: 630, format: 'jpeg' })
    );
  });
});
