import React from 'react';
import { render, screen } from '@testing-library/react';
import ListCard from '../components/ListCard';
import { useSignedIn } from '../firebase/auth';
import { List } from '../models/list';

jest.mock('../firebase/auth', () => ({
  useSignedIn: jest.fn(),
}));
jest.mock('../components/AddItem', () => () => null);
jest.mock('../components/ListItemCard', () => ({ item }) => (
  <span>{item.name}</span>
));

const list: List = {
  id: 'birthday',
  name: 'Birthday ideas',
  userId: 'user-1',
  userName: 'Sam',
  collaborate: false,
  items: Array.from({ length: 6 }, (_, index) => ({
    name: `Item ${index + 1}`,
  })),
  created: new Date(),
  updated: new Date(),
};

describe('ListCard', () => {
  beforeEach(() => {
    (useSignedIn as jest.Mock).mockReturnValue({ user: undefined });
  });

  it('links the title to an individual page that shows every item', () => {
    render(<ListCard list={list} onlyListShown />);

    expect(
      screen.getByRole('link', { name: 'Birthday ideas' }).getAttribute('href')
    ).toBe('/list/birthday');
    expect(screen.getByText('Item 6')).toBeTruthy();
    expect(screen.queryByText('Show more')).toBeNull();
  });
});
