// src/mcp-json.test.ts
import { it, expect, describe } from "bun:test";
import { McpJsonSchema, type McpJson } from "./mcp-json";

describe("McpJsonSchema", () => {
  it("validates a minimal mcp.json", () => {
    const input = {
      "memory-server": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-memory"],
      },
    };
    const result = McpJsonSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("validates mcp.json with includeTools", () => {
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

  it("rejects invalid structure", () => {
    const input = { "server": { command: 123 } };
    const result = McpJsonSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
