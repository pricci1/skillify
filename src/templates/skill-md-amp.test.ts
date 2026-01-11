import { it, expect, describe } from "bun:test";
import { renderTemplate } from "./render";

describe("skill-md-amp template", () => {
  it("renders basic amp skill", async () => {
    const result = await renderTemplate("skill-md-amp", {
      frontmatter: "---\nname: test\n---",
      name: "test-skill",
      toolList: "- `tool1` - Description 1\n- `tool2` - Description 2",
      customMessage: null,
    });

    expect(result).toContain("# test-skill");
    expect(result).toContain("## Available Tools");
    expect(result).toContain("- `tool1` - Description 1");
  });

  it("includes custom message when provided", async () => {
    const result = await renderTemplate("skill-md-amp", {
      frontmatter: "---\nname: test\n---",
      name: "test-skill",
      toolList: "- `tool1` - Desc",
      customMessage: "Custom instructions here.",
    });

    expect(result).toContain("Custom instructions here.");
  });
});

describe("skill-frontmatter-amp template", () => {
  it("renders with generated description", async () => {
    const result = await renderTemplate("skill-frontmatter-amp", {
      name: "memory",
      toolNames: "tool1, tool2",
      toolCount: 2,
      customDescription: null,
    });

    expect(result).toContain("name: memory");
    expect(result).toContain("MCP skill providing 2 tools: tool1, tool2");
  });

  it("uses custom description when provided", async () => {
    const result = await renderTemplate("skill-frontmatter-amp", {
      name: "memory",
      toolNames: "tool1",
      toolCount: 1,
      customDescription: "My custom description",
    });

    expect(result).toContain("description: 'My custom description'");
  });
});
