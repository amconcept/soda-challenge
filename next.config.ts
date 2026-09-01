import type { NextConfig } from "next";
import path from "path";

// Project Pages live at /soda-challenge until sodachallenge.org DNS is pointed here.
// Local `npm run dev` has no GITHUB_REPOSITORY, so this stays "".
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = process.env.BASE_PATH ?? (repoName ? `/${repoName}` : "");

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
