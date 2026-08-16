import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomApp from '../pages/_app';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));
jest.mock('../components/welcome', () => () => null);

describe('application head', () => {
  const originalVersion = process.env.NEXT_PUBLIC_BUILD_VERSION;
  const originalDate = process.env.NEXT_PUBLIC_BUILD_DATE;
  const originalSummary = process.env.NEXT_PUBLIC_BUILD_SUMMARY;

  afterEach(() => {
    process.env.NEXT_PUBLIC_BUILD_VERSION = originalVersion;
    process.env.NEXT_PUBLIC_BUILD_DATE = originalDate;
    process.env.NEXT_PUBLIC_BUILD_SUMMARY = originalSummary;
  });

  it('declares browser and Apple touch icons', () => {
    const Page = () => null;
    const { container } = render(
      <CustomApp Component={Page} pageProps={{}} router={{} as never} />
    );

    expect(
      container.querySelector('link[rel="icon"][href="/favicon.ico"]')
    ).toBeTruthy();
    expect(
      container.querySelector(
        'link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]'
      )
    ).toBeTruthy();
  });

  it('shows the deployed version, date, and release summary in the footer', () => {
    process.env.NEXT_PUBLIC_BUILD_VERSION = 'abc1234';
    process.env.NEXT_PUBLIC_BUILD_DATE = '16 Aug 2026';
    process.env.NEXT_PUBLIC_BUILD_SUMMARY = 'Improve social cards';
    const Page = () => null;

    render(<CustomApp Component={Page} pageProps={{}} router={{} as never} />);

    expect(screen.getByText('Version abc1234 · 16 Aug 2026')).toBeTruthy();
    expect(screen.getByText('Improve social cards')).toBeTruthy();
  });
});
