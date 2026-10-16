import { defineConfig } from "vite";
import { visage } from "@epoch32/visage/vite";
import { appRouter } from "./src/server/router";

export default defineConfig({
  plugins: [
    visage({
      rpc: {
        router: appRouter,
        endpoint: "/api/rpc"
      },
      experimental: {
        secureTransforms: true,
        csp: true
      }
    })
  ]
});
