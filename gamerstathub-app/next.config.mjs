/** @type {import('next').NextConfig} */
const nextConfig = {
  // this is needed so that the code for building emails works properly
  webpack: (
    /** @type {import('webpack').Configuration & { externals: string[] }} */
    config,
    { isServer },
  ) => {
    if (isServer) {
      config.externals.push('esbuild');
    }

    return config;
  },
  reactStrictMode: true,
  experimental: {
    middleware: true,
  },
  transpilePackages: ['react-email'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        port: '',
        pathname: '/cdn/**',
      },
      {
        protocol: 'https',
        hostname: 'yymvpswjxnabayeagyza.supabase.co', // Allow images from supabase
        port: '',
        pathname: '/storage/v1/object/public/**', // Match all images under storage path
      },
    ],
  },
};

export default nextConfig;
