import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = "ref.archive";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? `/${repo}` : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? `/${repo}` : "",
  },
};

export default nextConfig;
