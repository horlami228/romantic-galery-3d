import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - explicitly configure allowedDevOrigins for mobile testing
  // allowedDevOrigins: ["172.20.10.3", "localhost:3000", "*.local"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-488f9223861748549a473b048bba3a82.r2.dev",
      },
    ],
  },
};

export default nextConfig;
