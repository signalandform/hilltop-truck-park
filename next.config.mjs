/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zxsorqxdpfmsnuozbpcs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/contact/", destination: "/contact-us", permanent: true },
      { source: "/events/:slug", destination: "/markets/:slug", permanent: true },
      { source: "/admin/events", destination: "/admin/markets", permanent: false },
      { source: "/admin/events/:path*", destination: "/admin/markets/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
