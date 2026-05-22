/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? BASE : "",
  assetPrefix: isProd ? BASE : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? BASE : "",
  },
};

module.exports = nextConfig;
