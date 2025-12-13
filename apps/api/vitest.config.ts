import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import tsconfigPaths from "vite-tsconfig-paths";

const dbUrl = process.env.DB_URL;

export default defineWorkersConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },

        miniflare: dbUrl
          ? {
              bindings: {
                DB_URL: dbUrl,
              },
            }
          : undefined,
      },
    },
  },
});
