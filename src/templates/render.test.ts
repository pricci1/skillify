import { describe, it, expect } from "bun:test";
import { renderTemplate } from "./render";

describe("renderTemplate", () => {
  it("renders a template with data", async () => {
    const result = await renderTemplate("skill-frontmatter", {
      name: "test-skill",
      toolNames: "tool1, tool2",
      toolCount: 2
    });
    expect(result).toContain("name: test-skill");
  });
});
