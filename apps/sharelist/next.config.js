// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const packageJson = require('../../package.json');

const buildDate = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date());

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_VERSION:
      process.env.NEXT_PUBLIC_BUILD_VERSION ||
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
      packageJson.version,
    NEXT_PUBLIC_BUILD_DATE: process.env.NEXT_PUBLIC_BUILD_DATE || buildDate,
    NEXT_PUBLIC_BUILD_SUMMARY:
      process.env.NEXT_PUBLIC_BUILD_SUMMARY ||
      process.env.VERCEL_GIT_COMMIT_MESSAGE ||
      'Share lists with friends and discover something new.',
  },
  images: {
    domains: [
      'image.tmdb.org',
      'd2k4q26owzy373.cloudfront.net',
      'is1-ssl.mzstatic.com',
      'is2-ssl.mzstatic.com',
      'is3-ssl.mzstatic.com',
      'is4-ssl.mzstatic.com',
      'is5-ssl.mzstatic.com',
    ],
  },
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

module.exports = withNx(nextConfig);
