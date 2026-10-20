/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    return process.env.COZY_DEPLOYMENT_ENV === 'production' ? [] : [{
      source: '/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }]
  },
  async redirects() {
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: 'www.cozyhealth.org' }],
      destination: 'https://cozyhealth.org/:path*',
      permanent: true,
    }]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
