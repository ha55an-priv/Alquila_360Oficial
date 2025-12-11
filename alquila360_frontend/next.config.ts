import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Mantén las opciones de configuración existentes aquí
    // (ej: reactStrictMode, output, etc.)

    async rewrites() {
        return [
            {
               
                source: '/api/:path*',
                
                destination: 'http://localhost:3001/:path*',
            },
        ];
    },
};

export default nextConfig;