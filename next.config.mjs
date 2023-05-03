/* eslint-disable @typescript-eslint/no-var-requires */
//import { withSentryConfig } from '@sentry/nextjs'
import { withAxiom } from 'next-axiom'
import BundleAnalyzer from '@next/bundle-analyzer'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// const withTM = NextTranspileModules([])

const withVanillaExtract = createVanillaExtractPlugin()

/*
const sentryWebpackPluginOptions =
  process.env.VERCEL_ENV === 'production'
    ? {
        // Additional config options for the Sentry Webpack plugin. Keep in mind that
        // the following options are set automatically, and overriding them is not
        // recommended:
        //   release, url, org, project, authToken, configFile, stripPrefix,
        //   urlPrefix, include, ignore
        silent: false, // Logging when deploying to check if there is any problem
        validate: true,
        // https://github.com/getsentry/sentry-webpack-plugin#options.
      }
    : {
        silent: true, // Suppresses all logs
        dryRun: !process.env.SENTRY_AUTH_TOKEN,
      }

const blocksPage = ['/affiliates-program', '/affiliates-program/dashboard']
*/
/** @type {import('next').NextConfig} */
const config = {
  compiler: {
    styledComponents: true,
  },
   eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /*
  env: {
    API_KEY: process.env.BASE_URL,
    infuraApiKey: "7a347c78bd7d45608c4c611ed51c1e7a",
    //NEXT_PUBLIC_NODE_PRODUCTION:"da06d6e31b504628ac01f754c07d2745",
    'NEXT_PUBLIC_NODE_PRODUCTION_WSS':"wss://bsc-testnet.nodereal.io/ws/v1/da06d6e31b504628ac01f754c07d2745"
    NEXT_PUBLIC_NODE_PRODUCTION:"bsc-testnet.nodereal.io/v1/da06d6e31b504628ac01f754c07d2745"
  }*/
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
   transpilePackages: [
      '@pancakeswap/ui',
      '@pancakeswap/uikit',
      //'@pancakeswap/swap-sdk-core',
      //'@pancakeswap/farms',
      '@pancakeswap/localization',
      '@pancakeswap/hooks',
      //'@pancakeswap/multicall',
     // '@pancakeswap/token-lists',
      '@pancakeswap/utils',
      //'@pancakeswap/tokens',
      //'@pancakeswap/smart-router',
      '@wagmi',
      'wagmi',
      //'@ledgerhq',
      //'@gnosis.pm/safe-apps-wagmi',
    ],
  experimental: {
    scrollRestoration: true,
   
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-nft.pancakeswap.com',
        pathname: '/mainnet/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/info/token/:address',
        destination: '/info/tokens/:address',
      },
      {
        source: '/info/pool/:address',
        destination: '/info/pools/:address',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/tokens/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=604800',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/send',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/swap/:outputCurrency',
        destination: '/swap?outputCurrency=:outputCurrency',
        permanent: true,
      },
      {
        source: '/create/:currency*',
        destination: '/add/:currency*',
        permanent: true,
      },
      {
        source: '/farms/archived',
        destination: '/farms/history',
        permanent: true,
      },
      {
        source: '/pool',
        destination: '/liquidity',
        permanent: true,
      },
      {
        source: '/staking',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/syrup',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/collectibles',
        destination: '/nfts',
        permanent: true,
      },
      {
        source: '/info/pools',
        destination: '/info/pairs',
        permanent: true,
      },
      {
        source: '/info/pools/:address',
        destination: '/info/pairs/:address',
        permanent: true,
      },
    ]
  },
  webpack: (webpackConfig, { webpack }) => {
    // tree shake sentry tracing
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    )
    return webpackConfig
  },
}

export default withVanillaExtract(withAxiom(config))
 //withBundleAnalyzer(withVanillaExtract(withSentryConfig(withAxiom(config), sentryWebpackPluginOptions)))
