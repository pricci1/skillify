// src/target-parser.test.ts
import { it, expect, describe } from "bun:test";
import { parseTarget } from "./target-parser";

describe("parseTarget", () => {
  it("parses simple command", () => {
    const result = parseTarget("npx server");
    expect(result).toEqual({ command: "npx", args: ["server"] });
  });

  it("parses command with multiple args", () => {
    const result = parseTarget("npx -y @modelcontextprotocol/server-memory");
    expect(result).toEqual({
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-memory"],
    });
  });

  it("handles single command with no args", () => {
    const result = parseTarget("my-server");
    expect(result).toEqual({ command: "my-server", args: [] });
  });

  it("throws for http URL", () => {
    expect(() => parseTarget("http://localhost:3000")).toThrow(
      "SSE transport is deprecated"
    );
  });

  it("throws for https URL", () => {
    expect(() => parseTarget("https://api.example.com/mcp")).toThrow(
      "SSE transport is deprecated"
    );
  });
});
