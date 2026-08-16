import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ShareButton from '../components/ShareButton';

describe('ShareButton', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('opens the native share popup when it is available', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const share = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    });

    render(<ShareButton listId="birthday" listName="Birthday ideas" />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Share Birthday ideas' })
    );

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith('http://localhost/list/birthday')
    );
    await waitFor(() =>
      expect(share).toHaveBeenCalledWith({
        title: 'Birthday ideas | ShareList',
        text: 'Take a look at Birthday ideas on ShareList',
        url: 'http://localhost/list/birthday',
      })
    );
    expect(writeText.mock.invocationCallOrder[0]).toBeLessThan(
      share.mock.invocationCallOrder[0]
    );
  });

  it('copies the link and confirms it when native sharing is unavailable', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<ShareButton listId="birthday" listName="Birthday ideas" />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Share Birthday ideas' })
    );

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith('http://localhost/list/birthday')
    );
    expect((await screen.findByRole('status')).textContent).toBe(
      'Link copied to clipboard'
    );
  });
});
