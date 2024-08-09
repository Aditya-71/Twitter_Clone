import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Get rid of the CORS error
    proxy: {
      "/api": {
        target:process.env.BASE_URL ,
        changeOrigin: true,
        secure: false, // because it is not https , it is http
      },
    },
  },
});
