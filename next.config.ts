import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add other domains as needed (e.g., your Supabase storage domain)
      // {
      //   protocol: 'https',
      //   hostname: 'your-project-ref.supabase.co',
      // }
    ],
  },
};

export default nextConfig;
