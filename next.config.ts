import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "zv35rsaixcn4ha4e.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
