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

    const { NODE_ENV, API_VERSION, FASTAPI_INTERNAL_URL } = process.env;

    const isDevelopment = NODE_ENV === "development";
    const fastApiBaseUrl = `${FASTAPI_INTERNAL_URL}${API_VERSION}`;

    return [
      {
        source: `${API_VERSION}/:path*`,
        destination: isDevelopment 
        ? `${fastApiBaseUrl}/:path*` 
        : `${API_VERSION}/:path*`,
      },
      {
        source: "/docs",
        destination: isDevelopment
          ? `${FASTAPI_INTERNAL_URL}/docs`
          : `${API_VERSION}/docs`,
      },
      {
        source: "/openapi.json",
        destination: isDevelopment 
        ? `${fastApiBaseUrl}/openapi.json` 
        : `${API_VERSION}/openapi.json`,
      },
    ];
  },
}

export default nextConfig
