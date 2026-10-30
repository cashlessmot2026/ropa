import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { decartTokenDevPlugin } from "./server/decart-token-dev.js";

export default defineConfig(({ mode }) => {
  // Variables sin prefijo VITE_ (ej. DECART_API_KEY) solo existen en Node, nunca llegan al bundle.
  const env = loadEnv(mode, process.cwd(), "");
  // GitHub Pages sirve la app en /ropa/; en local va en la raíz.
  const base = env.BASE_PATH || "/";

  return {
    base,
    plugins: [
      react(),
      decartTokenDevPlugin(env.DECART_API_KEY),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icons/icon.svg", "products/*"],
        manifest: {
          name: "Ropa Try-On",
          short_name: "Ropa",
          description: "Tienda de ropa, gorras y zapatos con probador virtual en tiempo real.",
          lang: "es",
          start_url: base,
          scope: base,
          display: "standalone",
          orientation: "portrait",
          background_color: "#1b1020",
          theme_color: "#1b1020",
          icons: [
            { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,webp,jpg,woff2}"],
          // Nunca cachear llamadas a Supabase ni a Decart: son datos vivos / sesiones.
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.includes("/products/"),
              handler: "CacheFirst",
              options: { cacheName: "product-images", expiration: { maxEntries: 200 } },
            },
          ],
        },
      }),
    ],
  };
});
