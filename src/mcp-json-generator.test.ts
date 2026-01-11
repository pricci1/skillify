// src/mcp-json-generator.test.ts
import { it, expect, describe } from "bun:test";
import { generateMcpJson } from "./mcp-json-generator";

describe("generateMcpJson", () => {
  it("generates minimal stdio mcp.json content", () => {
    const result = generateMcpJson({
      name: "memory",
      target: "npx -y @modelcontextprotocol/server-memory",
    });

    expect(result).toEqual({
      "memory-server": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"],
      },
    });
  });

  it("generates url-based mcp.json for http targets", () => {
    const result = generateMcpJson({
      name: "deepwiki",
      target: "https://mcp.deepwiki.com/mcp",
    });

    expect(result).toEqual({
      "deepwiki-server": {
        url: "https://mcp.deepwiki.com/mcp",
      },
    });
  });

  it("includes tools when specified for stdio", () => {
    const result = generateMcpJson({
      name: "memory",
      target: "npx server",
      includeTools: ["tool1", "tool2"],
    });

    expect(result).toEqual({
      "memory-server": {
        command: "npx",
        args: ["server"],
        includeTools: ["tool1", "tool2"],
      },
    });
  });

  it("includes tools when specified for url", () => {
    const result = generateMcpJson({
      name: "deepwiki",
      target: "https://mcp.deepwiki.com/mcp",
      includeTools: ["ask_question"],
    });

    expect(result).toEqual({
      "deepwiki-server": {
        url: "https://mcp.deepwiki.com/mcp",
        includeTools: ["ask_question"],
      },
    });
  });

  it("omits includeTools when empty", () => {
    const result = generateMcpJson({
      name: "memory",
      target: "npx server",
      includeTools: [],
    });

    expect(result["memory-server"]?.includeTools).toBeUndefined();
  });
});
