import { defineConfig } from "vite";
import { visage } from "@epoch32/visage/vite";

export default defineConfig({
  plugins: [
    visage({
      experimental: {
        secureTransforms: true,
        csp: true
      }
    })
  ]
});
