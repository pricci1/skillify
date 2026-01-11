// src/mcp-json-generator.test.ts
import { it, expect, describe } from "bun:test";
import { generateMcpJson } from "./mcp-json-generator";

describe("generateMcpJson", () => {
  it("generates minimal mcp.json content", () => {
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

  it("includes tools when specified", () => {
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

  it("omits includeTools when empty", () => {
    const result = generateMcpJson({
      name: "memory",
      target: "npx server",
      includeTools: [],
    });

    expect(result["memory-server"]?.includeTools).toBeUndefined();
  });
});
