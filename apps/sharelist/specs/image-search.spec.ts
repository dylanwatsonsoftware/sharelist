import {
  getMovieArtwork,
  getPodcastArtwork,
  podcastSearchUrl,
} from '../libs/imageSearch';

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

  it('selects a matching movie or TV poster beyond the first result', () => {
    expect(
      getMovieArtwork(
        {
          results: [
            { title: 'Unrelated title', poster_path: '/unrelated.jpg' },
            {
              name: 'The Last of Us',
              poster_path: '/the-last-of-us.jpg',
              vote_count: 12,
            },
          ],
        },
        'The Last of Us',
        'w500'
      )
    ).toBe('https://image.tmdb.org/t/p/w500/the-last-of-us.jpg');
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
