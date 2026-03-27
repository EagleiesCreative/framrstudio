import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfkit', 'fontkit', 'linebreak'],
};

export default nextConfig;
