// Note: Keep this file untyped to avoid TS excess-property errors on custom fields.
// Next.js will ignore unknown options safely.

const nextConfig = {
    // config options here
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
