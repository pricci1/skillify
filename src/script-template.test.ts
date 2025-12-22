import { it, expect, describe } from "bun:test";
import { generateCallToolScript, generateMcpClientScript, generateScriptDocumentation } from "./script-template";
import type { ToolInfo } from "./introspect";

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

describe("generateScriptDocumentation", () => {
  it("generates usage section with tool examples", () => {
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
    const doc = generateScriptDocumentation(tools);
    expect(doc).toContain("## Using the MCP Script");
    expect(doc).toContain("bun scripts/call-tool.ts");
    expect(doc).toContain("search_files");
  });

  it("generates example with required parameters", () => {
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
    const doc = generateScriptDocumentation(tools);
    expect(doc).toContain("read_file");
    expect(doc).toContain('"path"');
  });
});
