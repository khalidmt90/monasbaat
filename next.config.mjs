/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Either domains or remotePatterns — remotePatterns is more flexible
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // add more CDNs later if needed
      // { protocol: "https", hostname: "cdn.yourvendor.com" },
    ],
  },
};

export default nextConfig;
