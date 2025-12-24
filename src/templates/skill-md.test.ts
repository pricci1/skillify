import { describe, it, expect } from "bun:test";
import { renderTemplate } from "./render";

describe("skill-md templates", () => {
  it("renders frontmatter with name and tools", async () => {
    const result = await renderTemplate("skill-frontmatter", {
      name: "test-skill",
      toolNames: "ask, search",
      toolCount: 2
    });
    expect(result).toContain("name: test-skill");
    expect(result).toContain("2 tools: ask, search");
  });

  it("renders tool section with parameters", async () => {
    const result = await renderTemplate("tool-section", {
      name: "ask",
      description: "Ask a question",
      params: [
        { key: "question", type: "string", required: true, description: "The question" }
      ],
      slug: "ask"
    });
    expect(result).toContain("### ask");
    expect(result).toContain("`question`");
  });
});
