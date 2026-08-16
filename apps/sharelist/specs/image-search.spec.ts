import { getPodcastArtwork, podcastSearchUrl } from '../libs/imageSearch';

const nextConfig = require('../next.config');

describe('podcast artwork search', () => {
  it('allows Apple artwork hosts through the Next.js image optimizer', () => {
    expect(nextConfig.images.domains).toEqual(
      expect.arrayContaining([
        'is1-ssl.mzstatic.com',
        'is2-ssl.mzstatic.com',
        'is3-ssl.mzstatic.com',
        'is4-ssl.mzstatic.com',
        'is5-ssl.mzstatic.com',
      ])
    );
  });

  it('builds an Apple Podcasts search and selects matching high-resolution artwork', () => {
    expect(podcastSearchUrl('Birds of Empire')).toContain(
      'media=podcast&entity=podcast&limit=5'
    );
    expect(
      getPodcastArtwork(
        {
          results: [
            {
              collectionName: 'Unrelated show',
              artworkUrl600: 'https://is1-ssl.mzstatic.com/unrelated.jpg',
            },
            {
              collectionName: 'Birds of Empire',
              artworkUrl600: 'https://is2-ssl.mzstatic.com/birds.jpg',
            },
          ],
        },
        'Birds of Empire'
      )
    ).toBe('https://is2-ssl.mzstatic.com/birds.jpg');
  });
});
