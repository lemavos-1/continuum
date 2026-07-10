import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    host: "::",
    port: Number(process.env.PORT) || Number(process.env.VITE_DEV_PORT) || 5173,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      devOptions: { enabled: false },
      filename: "sw.js",
      manifestFilename: "manifest.webmanifest",
      includeAssets: [
        "favicon.ico",
        "manifest.json",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "maskable-192x192.png",
        "maskable-512x512.png",
      ],
      manifest: {
        name: "Continuum",
        short_name: "Continuum",
        description:
          "A private, connected workspace for your notes, projects and people. Build your personal knowledge graph.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        theme_color: "#000000",
        background_color: "#000000",
        categories: ["productivity"],
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf}"],
        runtimeCaching: [
          {
            // App shell HTML — fresh first, fallback to cache offline.
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "continuum-html",
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts stylesheet — may change, keep it fresh in background.
            urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "continuum-font-css",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts files — immutable, cache aggressively.
            urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "continuum-fonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // App icons — always available offline for the installed app.
            urlPattern: ({ url, request }) =>
              request.destination === "image" &&
              (url.pathname.endsWith("apple-touch-icon.png") ||
                url.pathname.includes("/pwa-") ||
                url.pathname.includes("/maskable-")),
            handler: "CacheFirst",
            options: {
              cacheName: "continuum-icons",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Wallpaper + vault images (Backblaze B2 signed URLs, or app/account/wallpaper).
            urlPattern: ({ url, request }) =>
              request.destination === "image" &&
              (url.pathname.includes("/account/wallpaper") ||
                url.pathname.includes("/vault/") ||
                url.hostname.includes("backblaze")),
            handler: "CacheFirst",
            options: {
              cacheName: "continuum-images",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "lucide-react": path.resolve(__dirname, "./src/lib/heroicons.ts"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
