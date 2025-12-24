import { describe, it, expect } from "bun:test";
import { renderTemplate } from "./render";

describe("script-documentation template", () => {
  it("renders tool examples", async () => {
    const examples = [
      'bun scripts/call-tool.ts ask \'{"question":"test"}\'',
      'bun scripts/call-tool.ts search'
    ];
    const result = await renderTemplate("script-documentation", { examples });
    expect(result).toContain("## Using the MCP Script");
    expect(result).toContain(examples[0]!);
  });
});
