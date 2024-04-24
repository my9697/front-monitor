import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";


export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es", "cjs", "umd"],
      name: "mYuMonitor",
      fileName: "mYuMonitor",
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});
