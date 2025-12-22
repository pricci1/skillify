import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ToolInfo, PromptInfo } from "./introspect";

export interface GeneratorOptions {
  name: string;
  outputDir: string;
  tools: ToolInfo[];
  prompts: PromptInfo[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateFrontmatter(name: string, tools: ToolInfo[]): string {
  const toolNames = tools.map((t) => t.name).join(", ");
  return `---
name: ${name}
description: |
  MCP skill providing ${tools.length} tools: ${toolNames}.
  Use when you need to interact with ${name} capabilities.
---`;
}

function generateToolSection(tool: ToolInfo): string {
  const params = tool.inputSchema?.properties as Record<string, { type?: string; description?: string }> | undefined;
  const required = (tool.inputSchema?.required as string[]) || [];

  let section = `### ${tool.name}\n\n`;
  section += `${tool.description || "(No description)"}\n\n`;

  if (params && Object.keys(params).length > 0) {
    section += "**Parameters:**\n";
    for (const [key, value] of Object.entries(params)) {
      const isRequired = required.includes(key);
      const type = value.type || "unknown";
      const desc = value.description || "";
      section += `- \`${key}\` (${type}${isRequired ? ", required" : ""}): ${desc}\n`;
    }
    section += "\n";
  }

  section += `[Full schema →](./references/tools/${slugify(tool.name)}.md)\n`;
  return section;
}

function generateSkillMd(name: string, tools: ToolInfo[]): string {
  let content = generateFrontmatter(name, tools);
  content += `\n\n# ${name}\n\n`;
  content += `## Available Tools\n\n`;
  for (const tool of tools) {
    content += generateToolSection(tool) + "\n";
  }
  return content;
}

function generateToolReference(tool: ToolInfo): string {
  return `# ${tool.name}

${tool.description || "(No description)"}

## Input Schema

\`\`\`json
${JSON.stringify(tool.inputSchema, null, 2)}
\`\`\`
`;
}

export async function generateSkill(options: GeneratorOptions): Promise<void> {
  const { name, outputDir, tools } = options;

  await mkdir(outputDir, { recursive: true });
  await mkdir(join(outputDir, "references", "tools"), { recursive: true });

  const skillMd = generateSkillMd(name, tools);
  await writeFile(join(outputDir, "SKILL.md"), skillMd);

  for (const tool of tools) {
    const ref = generateToolReference(tool);
    await writeFile(
      join(outputDir, "references", "tools", `${slugify(tool.name)}.md`),
      ref
    );
  }
}
