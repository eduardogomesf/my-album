/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4566',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 's3',
        port: '4566',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
