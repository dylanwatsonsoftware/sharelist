import React from 'react';
import { render } from '@testing-library/react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import SharedListPage from '../pages/list/[id]';

jest.mock('next-seo', () => ({
  NextSeo: jest.fn(() => null),
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-firebase-hooks/firestore', () => ({
  useDocumentData: jest.fn(),
}));
jest.mock('../components/ListCard', () => () => null);

describe('shared list social metadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
          { name: 'Board game', image: 'https://images.example/game.jpg' },
          { name: 'A good book' },
        ],
      },
      false,
      undefined,
    ]);

    render(<SharedListPage />);

    expect(NextSeo).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Sam's Birthday ideas | ShareList",
        description: "Sam's Birthday ideas list: Board game, A good book",
        canonical: 'https://share-list.vercel.app/list/birthday',
        openGraph: {
          type: 'website',
          url: 'https://share-list.vercel.app/list/birthday',
          title: "Sam's Birthday ideas | ShareList",
          description: "Sam's Birthday ideas list: Board game, A good book",
          site_name: 'ShareList',
          images: [
            {
              url: 'https://images.example/game.jpg',
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
              url: expect.stringContaining('/_next/image?url=%2Fsharelist.png'),
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
});
