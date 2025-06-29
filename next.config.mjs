/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  rewrites: async () => {
    return [
      {
        source: '/api/v1/:path*',
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000/api/v1/:path*"
            : "/api/v1/:path",

      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000/docs"
            : "/docs/",
      },
      {
        source: "/openai.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000/openapi.json"
            : "/openapi.json",
      },
    ];
  },
}

export default nextConfig
