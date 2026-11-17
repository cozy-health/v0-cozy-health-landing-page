/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async headers() {
    const guardian = { source: '/guardian-authorization', headers: [{ key: 'Cache-Control', value: 'private, no-store' }, { key: 'Referrer-Policy', value: 'no-referrer' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }
    return process.env.COZY_DEPLOYMENT_ENV === 'production' ? [guardian] : [guardian, {
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
