import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O celular abre o dev server pelo IP da rede. Sem isso o Next bloqueia o JS e o menu não responde ao clique.
  allowedDevOrigins: ["192.168.0.58", "192.168.*.*"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
