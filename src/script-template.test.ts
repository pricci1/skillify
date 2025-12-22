import { it, expect, describe } from "bun:test";
import { generateCallToolScript, generateMcpClientScript } from "./script-template";

describe("generateCallToolScript", () => {
  it("embeds the target into the script", () => {
    const script = generateCallToolScript("node ./my-mcp.js");
    expect(script).toContain('const TARGET = "node ./my-mcp.js"');
  });

  it("includes shebang for bun", () => {
    const script = generateCallToolScript("node ./my-mcp.js");
    expect(script).toMatch(/^#!\/usr\/bin\/env bun/);
  });

  it("imports from mcp-client", () => {
    const script = generateCallToolScript("node ./my-mcp.js");
    expect(script).toContain('import { connectToMCP } from "./mcp-client.ts"');
  });
});

describe("generateMcpClientScript", () => {
  it("exports connectToMCP function", () => {
    const script = generateMcpClientScript();
    expect(script).toContain("export async function connectToMCP");
  });

  it("imports from @modelcontextprotocol/sdk", () => {
    const script = generateMcpClientScript();
    expect(script).toContain("@modelcontextprotocol/sdk");
  });
});
