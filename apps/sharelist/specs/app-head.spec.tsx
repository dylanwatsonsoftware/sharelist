import React from 'react';
import { render } from '@testing-library/react';
import CustomApp from '../pages/_app';

jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));
jest.mock('../components/welcome', () => () => null);

describe('application head', () => {
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
});
