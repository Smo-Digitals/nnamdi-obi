import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pub-98441fed78324e9089b80646393132ad.r2.dev' },
    ],
  },
};

export default nextConfig;
