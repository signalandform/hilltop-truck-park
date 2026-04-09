/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/contact/", destination: "/contact-us", permanent: true },
    ];
  },
};

export default nextConfig;
