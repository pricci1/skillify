#!/usr/bin/env bun
import { mkdir } from "node:fs/promises";

const result = await Bun.build({
  entrypoints: ["src/index.ts"],
  target: "bun",
  minify: true,
  outdir: "dist",
  naming: {
    entry: "index.js",
  },
});

if (!result.success) {
  console.error("Build failed:", result.logs);
  process.exit(1);
}

console.log("✓ Bundled CLI to dist/index.js");
console.log(`  Size: ${result.outputs[0]?.size || 0} bytes`);
