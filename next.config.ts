import type { NextConfig } from "next";

const basePath = "/ref.archive";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: `${basePath}/`,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
