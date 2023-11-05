/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
        ignoreDuringBuilds: true,
  },
  experimental: {
        serverComponentsExternalPackages: [
            '@react-email/components',
            '@react-email/render',
            '@react-email/tailwind'
        ]
    }
}

module.exports = nextConfig
