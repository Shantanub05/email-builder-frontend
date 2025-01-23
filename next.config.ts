/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 👈 Add this here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

module.exports = nextConfig;
