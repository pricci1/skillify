import { describe, it, expect } from "bun:test";
import { renderTemplate } from "./render";

describe("call-tool-script template", () => {
  it("embeds the target", async () => {
    const result = await renderTemplate("call-tool-script", { target: "npx my-server" });
    expect(result).toContain('const TARGET = "npx my-server"');
  });

  it("is a valid node shebang script", async () => {
    const result = await renderTemplate("call-tool-script", { target: "test" });
    expect(result.startsWith("#!/usr/bin/env node")).toBe(true);
  });
});
