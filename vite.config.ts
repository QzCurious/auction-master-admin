import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths'
import react from "@vitejs/plugin-react";

export default defineConfig({
  server:{
    port: 47816
  },
  plugins: [react(), tsconfigPaths(),],
});
