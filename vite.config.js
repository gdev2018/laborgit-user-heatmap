import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import purgecss from "vite-plugin-purgecss";
import postcss from "postcss";
import * as path from "path";
import pkg from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    purgecss(), // Purge unused CSS
    {
      name: "postcss",
      enforce: "pre",
      transformIndexHtml(html) {
        return html;
      },
      apply: "build",
      transform(code, id) {
        if (!id.endsWith(".css")) return null;
        return postcss().process(code);
      }
    }
  ],
  server: {
    open: true
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "react-cron-schedule-typescript",
      fileName: (format) => `${format === "es" ? "index.es.js" : "index.js"}`
    },
    rollupOptions: {
      external: Object.keys(
        { ...pkg.dependencies, ...pkg.peerDependencies } || {}
      ),
      output: {
        globals: {
          react: "React"
        }
      }
    }
  }
});
