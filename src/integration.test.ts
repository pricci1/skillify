// src/integration.test.ts
import { it, expect, describe, beforeEach, afterEach } from "bun:test";
import { rm, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { createCLI } from "./cli";

const TEST_OUTPUT = "/tmp/skillify-integration-test";

describe("pack --amp integration", () => {
  beforeEach(async () => {
    try {
      await rm(TEST_OUTPUT, { recursive: true });
    } catch {}
  });

  afterEach(async () => {
    try {
      await rm(TEST_OUTPUT, { recursive: true });
    } catch {}
  });

  it("generates amp skill structure", async () => {
    const cli = createCLI();
    await cli.parseAsync([
      "node",
      "skillify",
      "pack",
      "npx -y @anthropics/claude-code-mcp-server",
      "--amp",
      "--all",
      "--name",
      "claude-code",
      "-o",
      TEST_OUTPUT,
    ]);

    // Verify mcp.json exists and is valid
    const mcpJson = JSON.parse(
      await readFile(join(TEST_OUTPUT, "mcp.json"), "utf-8")
    );
    expect(mcpJson["claude-code-server"]).toBeDefined();
    expect(mcpJson["claude-code-server"].command).toBe("npx");

    // Verify SKILL.md exists with correct format
    const skillMd = await readFile(join(TEST_OUTPUT, "SKILL.md"), "utf-8");
    expect(skillMd).toContain("name: claude-code");
    expect(skillMd).toContain("MCP skill providing");

    // Verify no scripts directory
    await expect(access(join(TEST_OUTPUT, "scripts"))).rejects.toThrow();

    // Verify no references directory
    await expect(access(join(TEST_OUTPUT, "references"))).rejects.toThrow();
  });
});
