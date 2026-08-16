import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { config } from '../config';
import { listCollection } from '../firebase/collections';
import SharedListPage, { getServerSideProps } from '../pages/list/[id]';

jest.mock('next-seo', () => ({
  NextSeo: jest.fn(() => null),
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-firebase-hooks/firestore', () => ({
  useDocumentData: jest.fn(),
}));
jest.mock('../firebase/collections', () => ({
  listCollection: { doc: jest.fn() },
}));
jest.mock('../components/ListCard', () => () => null);

const originalFetch = global.fetch;

describe('shared list social metadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete config.paths.birthday;
  });

  it('uses the shared list details for Open Graph and Twitter cards', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: 'birthday' } });
    (useDocumentData as jest.Mock).mockReturnValue([
      {
        id: 'birthday',
        name: 'Birthday ideas',
        userId: 'user-1',
        userName: 'Sam',
        collaborate: false,
        items: [
          {
            name: 'Board game',
            image: 'https://d2k4q26owzy373.cloudfront.net/game.jpg',
          },
          {
            name: 'A good book',
            image: 'https://image.tmdb.org/t/p/w500/book.jpg',
          },
        ],
      },
      false,
      undefined,
    ]);

    render(<SharedListPage />);

    expect(NextSeo).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Birthday ideas by Sam | ShareList',
        description: "Sam's Birthday ideas list: Board game, A good book",
        canonical: 'https://share-list.vercel.app/list/birthday',
        openGraph: {
          type: 'website',
          url: 'https://share-list.vercel.app/list/birthday',
          title: 'Birthday ideas by Sam | ShareList',
          description: "Sam's Birthday ideas list: Board game, A good book",
          site_name: 'ShareList',
          images: [
            {
              url: 'https://share-list.vercel.app/api/social-card?image=https%3A%2F%2Fd2k4q26owzy373.cloudfront.net%2Fgame.jpg&image=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw500%2Fbook.jpg',
              alt: 'Birthday ideas',
            },
          ],
        },
        twitter: {
          cardType: 'summary_large_image',
          handle: '@dylanwatsonsw',
          site: '@dylanwatsonsw',
        },
      }),
      expect.anything()
    );
  });

  it('renders shareable metadata before the Firebase list has loaded', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: 'birthday' } });
    (useDocumentData as jest.Mock).mockReturnValue([
      undefined,
      true,
      undefined,
    ]);

    render(<SharedListPage />);

    expect(NextSeo).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Shared list | ShareList',
        canonical: 'https://share-list.vercel.app/list/birthday',
        openGraph: expect.objectContaining({
          url: 'https://share-list.vercel.app/list/birthday',
          images: [
            expect.objectContaining({
              url: 'https://share-list.vercel.app/api/social-card',
            }),
          ],
        }),
        twitter: expect.objectContaining({
          cardType: 'summary_large_image',
        }),
      }),
      expect.anything()
    );
  });

  it('shows that the list was not found after loading completes', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: 'missing' } });
    (useDocumentData as jest.Mock).mockReturnValue([
      undefined,
      false,
      undefined,
    ]);

    render(<SharedListPage />);

    expect(screen.getByText('List not found')).toBeTruthy();
    expect(screen.queryByText('Loading...')).toBeNull();
  });

  it('loads list metadata on the server for social crawlers', async () => {
    config.paths.birthday = 'birthday-document';
    const fetch = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://api.themoviedb.org/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            results: [
              {
                title: 'Board game',
                vote_count: 500,
                poster_path: '/board-game.jpg',
              },
            ],
          }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          fields: {
            name: { stringValue: 'Birthday ideas' },
            userName: { stringValue: 'Sam' },
            items: {
              arrayValue: {
                values: [
                  {
                    mapValue: {
                      fields: {
                        name: { stringValue: 'Board game' },
                      },
                    },
                  },
                ],
              },
            },
          },
        }),
      });
    });
    global.fetch = fetch as never;

    const result = await getServerSideProps({
      params: { id: 'birthday' },
    } as never);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/documents/lists/birthday-document?key=')
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://api.themoviedb.org/3/search/multi?api_key='
      )
    );

    const initialSeo = (result as { props: { initialSeo: object } }).props
      .initialSeo;
    const ActualNextSeo = jest.requireActual('next-seo').NextSeo;
    const head = new ActualNextSeo(initialSeo).render();
    const initialHtml = renderToStaticMarkup(<>{head.props.children}</>);

    expect(initialHtml).toContain('Birthday ideas by Sam | ShareList');
    expect(initialHtml).toContain('Sam&#x27;s Birthday ideas list: Board game');
    expect(initialHtml).toContain(
      'rel="canonical" href="https://share-list.vercel.app/list/birthday"'
    );
    expect(initialHtml).toContain(
      'property="og:image" content="https://image.tmdb.org/t/p/w500/board-game.jpg"'
    );
  });
});
