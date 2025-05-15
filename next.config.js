/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // 配置输出模式
  output: 'standalone',
};

module.exports = nextConfig; 