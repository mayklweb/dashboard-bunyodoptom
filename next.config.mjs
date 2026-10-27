/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.bunyodoptom.uz" }],
  },
}

export default nextConfig
