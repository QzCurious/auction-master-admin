import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server:{
    port: 47816
  },
  plugins: [react()],
});
