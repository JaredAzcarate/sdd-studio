import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  splitting: true,
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  dts: false,
  external: ["react-devtools-core"],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  loader: {
    ".tsx": "tsx",
  },
});
