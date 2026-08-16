import sharp from 'sharp';
import {
  createSocialCard,
  getCollageLayout,
  validateImageUrl,
} from '../pages/api/social-card';

describe('social card collage', () => {
  it('accepts Apple Podcasts artwork URLs', () => {
    expect(
      validateImageUrl('https://is1-ssl.mzstatic.com/image/podcast.jpg').href
    ).toBe('https://is1-ssl.mzstatic.com/image/podcast.jpg');
  });

  it('lays out three images with one large tile and two smaller tiles', () => {
    expect(getCollageLayout(3)).toEqual([
      { width: 558, height: 456, left: 36, top: 36 },
      { width: 558, height: 222, left: 606, top: 36 },
      { width: 558, height: 222, left: 606, top: 270 },
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
    const gutter = await sharp(card)
      .extract({ left: 598, top: 100, width: 4, height: 4 })
      .stats();
    const footer = await sharp(card)
      .extract({ left: 36, top: 510, width: 1128, height: 110 })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let footerLightPixels = 0;
    for (
      let offset = 0;
      offset < footer.data.length;
      offset += footer.info.channels
    ) {
      if (
        footer.data[offset] > 220 &&
        footer.data[offset + 1] > 220 &&
        footer.data[offset + 2] > 220
      ) {
        footerLightPixels += 1;
      }
    }

    expect(metadata).toEqual(
      expect.objectContaining({ width: 1200, height: 630, format: 'jpeg' })
    );
    expect(gutter.channels[0].mean).toBeLessThan(130);
    expect(footerLightPixels).toBeGreaterThan(2000);
  });

  it('creates a visible branded card when no item images are available', async () => {
    const card = await createSocialCard([]);
    const metadata = await sharp(card).metadata();
    const stats = await sharp(card).stats();
    const { data, info } = await sharp(card)
      .raw()
      .toBuffer({ resolveWithObject: true });
    let lightPixels = 0;
    for (let offset = 0; offset < data.length; offset += info.channels) {
      if (
        data[offset] > 220 &&
        data[offset + 1] > 220 &&
        data[offset + 2] > 220
      ) {
        lightPixels += 1;
      }
    }

    expect(metadata).toEqual(
      expect.objectContaining({ width: 1200, height: 630, format: 'jpeg' })
    );
    expect(stats.channels.some((channel) => channel.stdev > 5)).toBe(true);
    expect(lightPixels).toBeGreaterThan(20000);
  });
});
