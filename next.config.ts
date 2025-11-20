import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**",
      },
      // Link ảnh được upload từ API
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      // Làm tạm cho một số data ở db còn dùng
      {
        protocol: "https",
        hostname: "topanh.com",
        port: "",
        pathname: "/**",
      },
      // Làm tạm cho một số data ở db còn dùng
      {
        protocol: "https",
        hostname: "cacanhthaihoa.com",
        port: "",
        pathname: "/**",
      },
      // Làm tạm cho một số data ở db còn dùng
      {
        protocol: "https",
        hostname: "thanhnien.mediacdn.vn",
        port: "",
        pathname: "/**",
      },
      // Làm tạm cho một số data ở db còn dùng
      {
        protocol: "https",
        hostname: "cdn2.fptshop.com.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nishikigoi.life",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "danviet.ex-cdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kodamakoifarm.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn0497.cdn4s.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.nishikigoi-export.jp",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
