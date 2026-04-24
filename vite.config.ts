import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "reload-tailwind-config",
      handleHotUpdate({ file, server }) {
        if (file.endsWith("tailwind.config.js")) {
          server.ws.send({
            type: "full-reload",
            path: "*",
          });
        }
      },
    },
  ],
  server: {
    watch: {
      usePolling: false,
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
