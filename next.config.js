/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({
    reactStrictMode: true,
    swcMinify: true, // Bật minify với SWC
    experimental: {
        allowedDevOrigins: ['https://kqsx.xoso66.im'],
        browsersListForSwc: ['defaults', 'not IE 11'],
    },
    env: {
        // ✅ MỚI: Sử dụng backend local mới (có thể thay đổi khi deploy)
        BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5001",
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
        NEXT_PUBLIC_BACKEND_URL2: "https://scraper-1-fewd.onrender.com",
        NEXT_PUBLIC_BACKEND_URL3: process.env.NEXT_PUBLIC_BACKEND_URL3 || "http://localhost:5001",
        // Fallback về backend cũ nếu backend mới không hoạt động
        // NEXT_PUBLIC_BACKEND_URL: "https://backendkqxs-1.onrender.com",
        // NEXT_PUBLIC_BACKEND_URL3: "https://back-end-diendan.onrender.com",
        NEXTAUTH_URL: "https://kqsx.xoso66.im",
        NEXTAUTH_SECRET: "wWjNz+xGXQAUiV/SYroijKwI7n/qSMTZUNaCcKZAHhY=",
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i1-vnexpress.vnecdn.net',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'th.bing.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'kqsx.xoso66.im',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'media.npr.org',
                pathname: '/assets/img/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
    },
    // compiler: {
    //     removeConsole: {
    //         exclude: ['error'],
    //     },
    // },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.kqsx.xoso66.im' }],
                destination: 'https://kqsx.xoso66.im/:path*',
                permanent: true,
            },
            { source: '/xsmb/', destination: '/ket-qua-xo-so-mien-bac', permanent: true },
            { source: '/xosomn/', destination: '/ket-qua-xo-so-mien-nam', permanent: true },
            { source: '/xosomt/', destination: '/ket-qua-xo-so-mien-trung', permanent: true },
            { source: '/soicauMB', destination: '/soicau/soi-cau-mien-bac', permanent: true },
            { source: '/soicauMT', destination: '/soicau/soi-cau-mien-trung', permanent: true },
            { source: '/TaoDan', destination: '/tao-dan-de-dac-biet', permanent: true },
            { source: '/TaoDanD/2D/', destination: '/taodande/dan-2d/tao-dan-de-2d', permanent: true },
            { source: '/TaoDanD/3D4D/', destination: '/taodande/dan-3d4d/tao-dan-de-3d4d', permanent: true },
            { source: '/thongke/giaidacbiettuan', destination: '/thongke/giai-dac-biet-tuan', permanent: true },
            { source: '/thongke/dauduoi', destination: '/thongke/dau-duoi', permanent: true },
        ];
    },
});

