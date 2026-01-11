// src/mcp-json.test.ts
import { it, expect, describe } from "bun:test";
import { McpJsonSchema, type McpJson } from "./mcp-json";

describe("McpJsonSchema", () => {
  it("validates a minimal stdio mcp.json", () => {
    const input = {
      "memory-server": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"],
      },
    };
    const result = McpJsonSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("validates stdio mcp.json with includeTools", () => {
    const input = {
      "memory-server": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"],
        includeTools: ["tool1", "tool2"],
      },
    };
    const result = McpJsonSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("validates url-based mcp.json", () => {
    const input = {
      "deepwiki-server": {
        url: "https://mcp.deepwiki.com/mcp",
      },
    };
    const result = McpJsonSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("validates url-based mcp.json with headers", () => {
    const input = {
      "sourcegraph-server": {
        url: "https://sourcegraph.example.com/.api/mcp/v1",
        headers: { Authorization: "token abc123" },
      },
    };
    const result = McpJsonSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("validates url-based mcp.json with includeTools", () => {
    const input = {
      "deepwiki-server": {
        url: "https://mcp.deepwiki.com/mcp",
        includeTools: ["ask_question"],
      },
    };
    const result = McpJsonSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects invalid structure", () => {
    const input = { server: { command: 123 } };
    const result = McpJsonSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
