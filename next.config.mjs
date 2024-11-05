/** @type {import('next').NextConfig} */

import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // Image optimization configuration
  images: {
    domains: ['res.cloudinary.com', 'uploadthing.com'],
    unoptimized: process.env.NODE_ENV === 'development',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Handle OpenTelemetry instrumentation warnings
    config.ignoreWarnings = [
      // Ignore warnings about critical dependency
      /Critical dependency: the request of a dependency is an expression/,
    ];

    // Handle external packages that need special treatment
    if (isServer) {
      config.externals = [...config.externals,
        'utf-8-validate',
        'bufferutil',
      ];
    }

    // Handle OpenTelemetry instrumentation packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'perf_hooks': false,
        'diagnostics_channel': false,
      };
    }

    // Enable source maps in production
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },

  // Performance optimizations
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // Cache optimization
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    instrumentationHook: true,    
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      }
    ];
  }
};

export default withSentryConfig(
  nextConfig,
  {
    org: "feest",
    project: "Shareflyt",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
  }
);