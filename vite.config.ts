import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
// import pkg from "./package.json";

// todo next revert to prev version
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
  },
  build: {
    outDir: "./dist",
    rollupOptions: {
      input: "src/main.tsx", // specify the entry point of your application
      output: {
        dir: "dist", // specify the output directory
        entryFileNames: `app_calendar_heatmap.bundle.js`, // specify the output file
        format: "iife", // specify the format of the output file
        name: "app_calendar_heatmap", // specify the name of the global variable
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      exclude: [
        "node_modules/lodash-es/**",
        "node_modules/@types/lodash-es/**",
      ],
    },
    assetsInlineLimit: 10240, // 10KB
  },
  optimizeDeps: {
    include: ["lodash", "date-fns"], // Add dependencies that need to be pre-bundled
    exclude: ["lodash-es", "@types/lodash-es"], // Exclude dependencies that should not be optimized
    entries: ["src/main.tsx"], // Specify custom entry points for optimization
  },
});