import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_BASE_URL,
        changeOrigin: true,
        secure: false, // Use this if you're working with HTTP and not HTTPS
      },
    },
  },
  build: {
    outDir: 'dist', // Directory to output the build files
    rollupOptions: {
      input: {
        main: 'index.html', // Main HTML file for the build
      },
    },
  },
});
