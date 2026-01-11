import { describe, it, expect } from "bun:test";
import { renderTemplate } from "./render";

describe("script-documentation template", () => {
  it("renders tool examples", async () => {
    const examples = [
      'node scripts/call-tool.js ask \'{"question":"test"}\'',
      'node scripts/call-tool.js search'
    ];
    const result = await renderTemplate("script-documentation", { examples });
    expect(result).toContain("## Usage");
    expect(result).toContain(examples[0]!);
  });
});
