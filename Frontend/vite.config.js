import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// console.log('VITE_BASE_URL:', import.meta.env.BASE_URL);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Get rid of the CORS error
    proxy: {
      "/api": {
<<<<<<< HEAD
        target: process.env.VITE_BASE_URL ,
=======
        target:import.meta.env.VITE_BASE_URL ,
>>>>>>> 986a6e6898b1cc591487ad2ef4edc8e70af772b6
        changeOrigin: true,
        secure: false, // because it is not https , it is http
      },
    },
  },
});
