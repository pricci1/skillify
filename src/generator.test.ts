import { it, expect, describe, beforeEach, afterEach } from "bun:test";
import { mkdir, readFile, access, rm } from "node:fs/promises";
import { join } from "node:path";
import { generateSkill } from "./generator";
import type { ToolInfo } from "./introspect";

const TEST_OUTPUT = "/tmp/skillify-test";

const sampleTools: ToolInfo[] = [
  {
    name: "read_file",
    description: "Read a file",
    inputSchema: {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
    },
  },
];

describe("generateSkill", () => {
  beforeEach(async () => {
    try {
      await rm(TEST_OUTPUT, { recursive: true });
    } catch {
      // ignore
    }
  });

  afterEach(async () => {
    try {
      await rm(TEST_OUTPUT, { recursive: true });
    } catch {
      // ignore
    }
  });

  it("generates SKILL.md with basic structure", async () => {
    await generateSkill({
      name: "test-skill",
      outputDir: TEST_OUTPUT,
      tools: sampleTools,
      prompts: [],
    });

    const content = await readFile(join(TEST_OUTPUT, "SKILL.md"), "utf-8");
    expect(content).toContain("name: test-skill");
    expect(content).toContain("# test-skill");
    expect(content).toContain("read_file");
  });

  it("creates tool references", async () => {
    await generateSkill({
      name: "test-skill",
      outputDir: TEST_OUTPUT,
      tools: sampleTools,
      prompts: [],
    });

    const content = await readFile(
      join(TEST_OUTPUT, "references", "tools", "read-file.md"),
      "utf-8"
    );
    expect(content).toContain("# read_file");
  });

  it("creates scripts directory with embedded target when withScript is true", async () => {
    await generateSkill({
      name: "test-skill",
      outputDir: TEST_OUTPUT,
      tools: sampleTools,
      prompts: [],
      withScript: true,
      target: "node ./my-server.js",
    });

    const content = await readFile(
      join(TEST_OUTPUT, "scripts", "call-tool.js"),
      "utf-8"
    );
    expect(content).toContain('const TARGET = "node ./my-server.js"');
  });

  it("adds script documentation to SKILL.md when withScript is true", async () => {
    await generateSkill({
      name: "test-skill",
      outputDir: TEST_OUTPUT,
      tools: sampleTools,
      prompts: [],
      withScript: true,
      target: "node ./test.js",
    });

    const content = await readFile(join(TEST_OUTPUT, "SKILL.md"), "utf-8");
    expect(content).toContain("## Usage");
  });

  it("does not create scripts directory when withScript is false", async () => {
    await generateSkill({
      name: "test-skill",
      outputDir: TEST_OUTPUT,
      tools: sampleTools,
      prompts: [],
    });

    await expect(access(join(TEST_OUTPUT, "scripts"))).rejects.toThrow();
  });

  it("generates mcp.json when amp is true", async () => {
    await generateSkill({
      name: "test-skill",
      outputDir: TEST_OUTPUT,
      tools: sampleTools,
      prompts: [],
      target: "npx -y @mcp/server",
      amp: true,
    });

    const content = await readFile(join(TEST_OUTPUT, "mcp.json"), "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed["test-skill-server"]).toBeDefined();
    expect(parsed["test-skill-server"].command).toBe("npx");
  });

  it("does not create scripts directory when amp is true", async () => {
    await generateSkill({
      name: "test-skill",
      outputDir: TEST_OUTPUT,
      tools: sampleTools,
      prompts: [],
      target: "npx -y @mcp/server",
      amp: true,
    });

    await expect(access(join(TEST_OUTPUT, "scripts"))).rejects.toThrow();
  });

  it("does not create references directory when amp is true", async () => {
    await generateSkill({
      name: "test-skill",
      outputDir: TEST_OUTPUT,
      tools: sampleTools,
      prompts: [],
      target: "npx -y @mcp/server",
      amp: true,
    });

    await expect(access(join(TEST_OUTPUT, "references"))).rejects.toThrow();
  });

  it("throws error when amp is true but target is missing", async () => {
    let error: Error | null = null;
    try {
      await generateSkill({
        name: "test-skill",
        outputDir: TEST_OUTPUT,
        tools: sampleTools,
        prompts: [],
        amp: true,
      });
    } catch (e) {
      error = e as Error;
    }

    expect(error).toBeDefined();
    expect(error?.message).toContain("Target is required for amp mode");
  });
});
