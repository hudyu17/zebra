/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/-79.4005188,43.6622882,12',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
