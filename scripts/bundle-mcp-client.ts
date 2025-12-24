import { mkdir, writeFile } from "node:fs/promises";

const result = await Bun.build({
  entrypoints: ["src/scripts/mcp-client.src.ts"],
  target: "node",
  minify: true,
});

if (!result.outputs[0]) {
  console.error("Build failed:", result.logs);
  process.exit(1);
}

const bundled = await result.outputs[0].text();

await mkdir("src/generated", { recursive: true });
await writeFile(
  "src/generated/mcp-client.bundled.ts",
  `// Auto-generated - do not edit\nexport const mcpClientBundled = ${JSON.stringify(bundled)};\n`
);

console.log("Bundled mcp-client.js →", bundled.length, "bytes");
