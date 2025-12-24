import { it, expect, describe } from "bun:test";
import { generateCallToolScript, generateMcpClientScript, generateScriptDocumentation } from "./script-template";
import type { ToolInfo } from "./introspect";

describe("generateCallToolScript", () => {
  it("embeds the target into the script", async () => {
    const script = await generateCallToolScript("node ./my-mcp.js");
    expect(script).toContain('const TARGET = "node ./my-mcp.js"');
  });

  it("includes shebang for node", async () => {
    const script = await generateCallToolScript("node ./my-mcp.js");
    expect(script).toMatch(/^#!\/usr\/bin\/env node/);
  });

  it("imports from mcp-client", async () => {
    const script = await generateCallToolScript("node ./my-mcp.js");
    expect(script).toContain('import { connectToMCP } from "./mcp-client.js"');
  });
});

describe("generateMcpClientScript", () => {
  it("exports connectToMCP function", () => {
    const script = generateMcpClientScript();
    expect(script).toContain("connectToMCP");
    expect(script).toMatch(/export\s*\{[^}]*connectToMCP/);
  });

  it("is bundled with MCP SDK dependencies inlined", () => {
    const script = generateMcpClientScript();
    expect(script).toContain("SSEClientTransport");
    expect(script).toContain("StdioClientTransport");
  });
});

describe("generateScriptDocumentation", () => {
  it("generates usage section with tool examples", async () => {
    const tools: ToolInfo[] = [
      {
        name: "search_files",
        description: "Search for files",
        inputSchema: {
          type: "object",
          properties: { pattern: { type: "string" } },
          required: ["pattern"],
        },
      },
    ];
    const doc = await generateScriptDocumentation(tools);
    expect(doc).toContain("## Using the MCP Script");
    expect(doc).toContain("node scripts/call-tool.js");
    expect(doc).toContain("search_files");
  });

  it("generates example with required parameters", async () => {
    const tools: ToolInfo[] = [
      {
        name: "read_file",
        description: "Read a file",
        inputSchema: {
          type: "object",
          properties: { path: { type: "string", description: "File path" } },
          required: ["path"],
        },
      },
    ];
    const doc = await generateScriptDocumentation(tools);
    expect(doc).toContain("read_file");
    expect(doc).toContain('"path"');
  });
});
