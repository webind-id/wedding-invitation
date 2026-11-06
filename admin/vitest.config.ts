import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      include: ["src/lib/**/*.ts", "src/shared/**/*.ts"],
      // Lapisan akses DB/cookie — diuji lewat build & uji manual, bukan unit test.
      exclude: ["src/lib/supabase.ts", "src/lib/auth.ts", "src/lib/repo/**", "src/lib/cn.ts"],
    },
  },
});
