/** @type {import('next').NextConfig} */
const nextConfig = {
    // Other configurations
    experimental: {
      fontLoaders: [
        { loader: '@next/font/google' }
      ]
    },

    images: {
      domains: [
        'res.cloudinary.com',
        'tse3.mm.bing.net',
        'tse1.mm.bing.net',
        'tse2.mm.bing.net',
        'tse4.mm.bing.net',
        // Add other common image domains you might use
        'images.unsplash.com',
        'via.placeholder.com',
        'picsum.photos',
        'localhost' // For local development
      ],
    },
}

module.exports = nextConfig