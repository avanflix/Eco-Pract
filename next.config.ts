import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "4779f9700aa357ebd8064457b69bda5e.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-d0e908e54a7b47f78813f1bff0d41c5b.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-90128cc82748409abc1429b2f1594649.r2.dev",
      }
    ],
  },
};

export default nextConfig;
