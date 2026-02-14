import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => ({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 1. Dile a Vite que ignore la carpeta src-tauri para evitar el bucle
      ignored: ["**/src-tauri/**"],
    },
  },
}));