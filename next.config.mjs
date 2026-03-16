/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/about', destination: '/' },
      { source: '/experiences', destination: '/' },
      { source: '/education', destination: '/' },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      use: 'raw-loader',
    })
    return config
  },
}

export default nextConfig
