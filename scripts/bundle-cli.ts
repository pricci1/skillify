#!/usr/bin/env bun
import { mkdir, cp } from "node:fs/promises";
import { Glob } from "bun";

const result = await Bun.build({
  entrypoints: ["src/index.ts"],
  target: "node",
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

const glob = new Glob("*.ejs");
let templateCount = 0;
for await (const file of glob.scan("src/templates")) {
  await cp(`src/templates/${file}`, `dist/${file}`);
  templateCount++;
}
console.log(`✓ Copied ${templateCount} EJS templates to dist/`);
