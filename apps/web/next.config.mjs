/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    return [
      {
        source: "/api/flags",
        destination: `${apiUrl}/api/flags`,
      },
      {
        source: "/api/snippets",
        destination: `${apiUrl}/api/snippets`,
      },
      {
        source: "/api/snippets/top",
        destination: `${apiUrl}/api/snippets/top`,
      },
      {
        source: "/api/snippets/:slug/like",
        destination: `${apiUrl}/api/snippets/:slug/like`,
      },
      {
        source: "/api/snippets/:slug",
        destination: `${apiUrl}/api/snippets/:slug`,
      },
    ];
  },
};

export default nextConfig;
