import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddItem from '../components/AddItem';
import { listCollection } from '../firebase/collections';

jest.mock('../firebase/auth', () => ({
  useSignedIn: () => ({
    isSignedIn: true,
    user: { uid: 'user-1', displayName: 'Sam' },
  }),
}));
jest.mock('../firebase/collections', () => ({
  listCollection: { doc: jest.fn() },
}));
jest.mock('firebase/app', () => ({
  firestore: {
    FieldValue: {
      arrayUnion: (value) => value,
      serverTimestamp: () => 'now',
    },
  },
}));

describe('AddItem autocomplete', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (listCollection.doc as jest.Mock).mockReturnValue({
      update: jest.fn().mockResolvedValue(undefined),
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        suggestions: [
          {
            id: 'tmdb:603',
            name: 'The Matrix',
            subtitle: 'Movie · 1999',
            image: 'https://image.tmdb.org/t/p/w92/matrix.jpg',
            url: 'https://www.themoviedb.org/movie/603',
            source: 'tmdb',
          },
        ],
      }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('debounces suggestions and saves the selected result metadata', async () => {
    render(
      <AddItem
        list={{
          id: 'movies',
          name: 'Movies',
          userId: 'user-1',
          userName: 'Sam',
          collaborate: false,
          items: [],
          created: new Date(),
          updated: new Date(),
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'The Matrix' },
    });
    expect(global.fetch).not.toHaveBeenCalled();

    await act(async () => jest.advanceTimersByTime(300));
    expect(
      await screen.findByRole('option', { name: 'Add “The Matrix” as typed' })
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole('option', { name: 'The Matrix Movie · 1999' })
    );

    await waitFor(() =>
      expect(listCollection.doc('movies').update).toHaveBeenCalledWith({
        items: {
          name: 'The Matrix',
          image: 'https://image.tmdb.org/t/p/w92/matrix.jpg',
          url: 'https://www.themoviedb.org/movie/603',
          source: 'tmdb',
          externalId: 'tmdb:603',
          addedById: 'user-1',
          addedByName: 'Sam',
        },
        updated: 'now',
      })
    );
  });
});
