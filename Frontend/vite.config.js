import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Get rid of the CORS error
    proxy: {
      "/api": {
        target:import.meta.env.VITE_BASE_URL ,
        changeOrigin: true,
        secure: false, // because it is not https , it is http
      },
    },
  },
});
