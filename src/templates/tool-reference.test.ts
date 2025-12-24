import { describe, it, expect } from "bun:test";
import { renderTemplate } from "./render";

describe("tool-reference template", () => {
  it("renders tool name and schema", async () => {
    const result = await renderTemplate("tool-reference", {
      name: "ask",
      description: "Ask a question",
      schemaJson: '{\n  "type": "object"\n}'
    });
    expect(result).toContain("# ask");
    expect(result).toContain("```json");
    expect(result).toContain('"type": "object"');
  });
});
