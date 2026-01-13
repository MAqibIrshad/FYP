// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//   remotePatterns: [
//     {
//       protocol: 'https',
//       hostname: 'gengrow.t3.storage.dev',
//     },
//     {
//       protocol: 'https',
//       hostname: 'gengrow-lms.fly.storage.tigris.dev',
//     },
//   ],
// }

// };

// module.exports = nextConfig;



// // next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gengrow.fly.storage.tigris.dev',
        }
    ],
  },
};

module.exports = nextConfig;
