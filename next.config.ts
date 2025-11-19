import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Webpack configuration to support path aliases
  webpack: (config) => {
    // Next.js automatically handles tsconfig paths, but we ensure it's properly configured
    return config;
  },
};

export default nextConfig;
