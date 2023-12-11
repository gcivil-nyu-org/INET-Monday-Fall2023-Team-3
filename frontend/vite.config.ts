import { UserConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const baseConfig: UserConfig = {
    plugins: [react()],
    resolve: {
      alias: {
        src: "/src",
        utils: "/src/utils",
        components: "/src/components",
        views: "/src/views",
      },
    },
  };

  if (command === "serve") {
    baseConfig.server = {
      proxy: {
        "/backend/": {
          target: "http://127.0.0.1:8000/",
        },
      },
    };
  }

  return baseConfig;
});
