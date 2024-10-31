// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com', 'uploadthing.com'],
    },
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    webpack: (config) => {
      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil"
      });
      return config;
    },
  }
  
export default nextConfig