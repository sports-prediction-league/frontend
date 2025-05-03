import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 5 MB limit
      },
      includeAssets: ["favicon.svg", "robots.txt"], // optional
      manifest: {
        name: "SPL",
        short_name: "SPL",
        display: "standalone",
        background_color: "#000000",
        start_url: "/",
        description: "The ultimate sports prediction league",
        theme_color: "#000000",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "screenshots/spl-home.png",
            sizes: "540x720",
            type: "image/png",
            label: "Home screen",
            form_factor: "wide",
          },
          {
            src: "screenshots/spl-leaderboard.png",
            sizes: "540x720",
            type: "image/png",
            label: "Leaderboard screen",
            // form_factor: "",
          },
        ],
      },
    }),
  ],
});
