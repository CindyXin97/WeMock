/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // 禁用特定页面的静态生成
  output: 'standalone',
};

module.exports = nextConfig; 