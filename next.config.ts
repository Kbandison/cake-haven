import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com",
      "ydsuyfkluoxpnfjdulqo.supabase.co",
      // add any other domains you use for product images here
    ],
  },
};

export default nextConfig;
