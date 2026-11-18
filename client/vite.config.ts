import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // `vite --mode emulator` (npm run dev:emulator) points every import of
  // dllm-client-config.json at the local emulator config instead.
  resolve:
    mode === "emulator"
      ? {
          alias: [
            {
              find: /^(\.\.?\/)+dllm-client-config\.json$/,
              replacement: path.resolve(
                __dirname,
                "src/dllm-client-config.emulator.json",
              ),
            },
          ],
        }
      : undefined,
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        // Use non-module format for better compatibility
        format: 'iife',
        // Ensure assets are properly referenced
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Disable code-splitting for better compatibility
        manualChunks: undefined
      }
    }
  },
  base: "/", // Ensure assets are loaded from the root
  define: {
    global: "globalThis",
    "process.env.PUBLIC_URL": JSON.stringify(""),
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
