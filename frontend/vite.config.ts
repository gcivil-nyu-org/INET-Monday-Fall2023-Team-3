import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
      utils: "/src/utils",
      components: "/src/components",
      views: "/src/views",
    },
  },
});
