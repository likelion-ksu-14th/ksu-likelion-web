import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ibb.co 호스팅 이미지 (멤버 프로필, 갤러리, OG 이미지 등)
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },
};

export default nextConfig;
