/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
   images: {
      domains: ["res.cloudinary.com"],
   },
};

const config = withPWA({
   dest: "public",
   register: true,
   skipWaiting: true,
   disable: process.env.NODE_ENV === "development",
})(nextConfig);

export default nextConfig;
