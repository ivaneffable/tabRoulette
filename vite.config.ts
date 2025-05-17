import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: "./src/background.ts",
        popup: "./src/popup.ts",
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
});
