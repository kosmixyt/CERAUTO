import { resolve } from "path";
import {
  defineConfig,
  externalizeDepsPlugin,
  bytecodePlugin,
} from "electron-vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin(), tailwindcss()],
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
      },
    },
    plugins: [vue(), tailwindcss()],
  },
});
