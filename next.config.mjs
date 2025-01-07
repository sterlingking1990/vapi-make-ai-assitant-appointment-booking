/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false, // Ensures that errors are not ignored during build
  },
};

export default nextConfig;
