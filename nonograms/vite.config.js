import postcssImport from "postcss-import";
import { resolve } from "path";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";

export default defineConfig({
  base: "./",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        //eslint-disable-next-line no-undef
        main: resolve(__dirname, "index.html"),
      },
    },
    cssCodeSplit: false,
  },
  css: {
    postcss: {
      plugins: [postcssImport(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      //eslint-disable-next-line no-undef
      "@": resolve(__dirname, "./src"),
    },
  },
});
