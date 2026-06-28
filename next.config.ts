import type { NextConfig } from "next";

// Next.js 16 blocks cross-origin requests to the dev server by default, allowing
// only the host it was initialized with (localhost). When you open the dev site
// from a phone on the same Wi-Fi via the machine's LAN IP, those requests count
// as cross-origin, so HMR and Server Actions (e.g. the "New page" button) silently
// fail. Allowing the private LAN ranges below fixes accessing the dev server from
// other devices on the network. Wildcards match per dot-segment, so the segment
// counts here are intentional (e.g. "192.168.*.*" covers a full /16).
const lanOrigins = [
  "192.168.68.103",
  "192.168.68.*",
  "192.168.*.*",
  "10.*.*.*",
  "172.16.*.*",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: lanOrigins,
  experimental: {
    // Belt-and-suspenders: also trust the LAN origins for the Server Actions
    // CSRF check, in case the request reaches the server with a forwarded host.
    serverActions: {
      allowedOrigins: lanOrigins,
    },
  },
};

export default nextConfig;
