/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: false,
  },
  experimental: {
    // Activer les optimisations turbopack
    turbo: {
      loaders: {
        // Optimiser les chargements des modules
        '.js': { swc: {} },
        '.ts': { swc: {} },
        '.tsx': { swc: {} },
      },
    },
    // Activer l'optimisation des images
    optimizeImages: true,
    // Activer la compression
    compress: true
  },
  // Optimisations pour la production
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

export default nextConfig; 