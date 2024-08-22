import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
// import pkg from "./package.json";

// todo next revert to prev version
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src")
    }
  },
  server: {
    open: true
  },
  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, "src/main.tsx"),
  //     name: "app_calendar_heatmap",
  //     fileName: (format) => `${format === "es" ? "index.es.js" : "index.js"}`
  //   },
  //   outDir: "./dist",
  //   rollupOptions: {
  //     external: Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies } || {}),
  //     output: {
  //       globals: {
  //         react: "React"
  //       }
  //     }
  //   }
  // }
  build: {
    outDir: "./dist",
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        dir: "dist",
        entryFileNames: `app_calendar_heatmap.bundle.js`, // specify the output file
        format: "iife",
        name: "app_calendar_heatmap" // specify the name of the global variable
      }
    }
    // commonjsOptions: {
    //   transformMixedEsModules: true,
    //   exclude: ["node_modules/lodash-es/**", "node_modules/@types/lodash-es/**"]
    // },
    // assetsInlineLimit: 10240 // 10KB
  }
  // optimizeDeps: {
  //   include: ["lodash", "date-fns"], // Add dependencies that need to be pre-bundled
  //   exclude: ["lodash-es", "@types/lodash-es"], // Exclude dependencies that should not be optimized
  //   entries: ["src/main.tsx"] // Specify custom entry points for optimization
  // }
});
