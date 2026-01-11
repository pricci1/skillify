// src/target-parser.test.ts
import { it, expect, describe } from "bun:test";
import { parseTarget } from "./target-parser";

describe("parseTarget", () => {
  it("parses simple command", () => {
    const result = parseTarget("npx server");
    expect(result).toEqual({ type: "stdio", command: "npx", args: ["server"] });
  });

  it("parses command with multiple args", () => {
    const result = parseTarget("npx -y @modelcontextprotocol/server-memory");
    expect(result).toEqual({
      type: "stdio",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-memory"],
    });
  });

  it("handles single command with no args", () => {
    const result = parseTarget("my-server");
    expect(result).toEqual({ type: "stdio", command: "my-server", args: [] });
  });

  it("parses http URL as Streamable HTTP", () => {
    const result = parseTarget("http://localhost:3000/mcp");
    expect(result).toEqual({ type: "url", url: "http://localhost:3000/mcp" });
  });

  it("parses https URL as Streamable HTTP", () => {
    const result = parseTarget("https://mcp.deepwiki.com/mcp");
    expect(result).toEqual({ type: "url", url: "https://mcp.deepwiki.com/mcp" });
  });
});
