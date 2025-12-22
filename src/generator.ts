import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ToolInfo, PromptInfo } from "./introspect";
import {
  generateCallToolScript,
  generateMcpClientScript,
  generateScriptDocumentation,
} from "./script-template";

export interface GeneratorOptions {
  name: string;
  outputDir: string;
  tools: ToolInfo[];
  prompts: PromptInfo[];
  withScript?: boolean;
  target?: string;
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

function generateSkillMd(name: string, tools: ToolInfo[], withScript?: boolean): string {
  let content = generateFrontmatter(name, tools);
  content += `\n\n# ${name}\n\n`;
  content += `## Available Tools\n\n`;
  for (const tool of tools) {
    content += generateToolSection(tool) + "\n";
  }

  if (withScript) {
    content += generateScriptDocumentation(tools);
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
  const { name, outputDir, tools, withScript, target } = options;

  await mkdir(outputDir, { recursive: true });
  await mkdir(join(outputDir, "references", "tools"), { recursive: true });

  const skillMd = generateSkillMd(name, tools, withScript);
  await writeFile(join(outputDir, "SKILL.md"), skillMd);

  for (const tool of tools) {
    const ref = generateToolReference(tool);
    await writeFile(
      join(outputDir, "references", "tools", `${slugify(tool.name)}.md`),
      ref
    );
  }

  if (withScript && target) {
    await mkdir(join(outputDir, "scripts"), { recursive: true });
    await writeFile(
      join(outputDir, "scripts", "call-tool.ts"),
      generateCallToolScript(target)
    );
    await writeFile(
      join(outputDir, "scripts", "mcp-client.ts"),
      generateMcpClientScript()
    );
  }
}
