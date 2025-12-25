import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ToolInfo, PromptInfo } from "./introspect";
import {
  generateCallToolScript,
  generateMcpClientScript,
  generateScriptDocumentation,
} from "./script-template";
import { renderTemplate } from "./templates/render";

export interface GeneratorOptions {
  name: string;
  outputDir: string;
  tools: ToolInfo[];
  prompts: PromptInfo[];
  withScript?: boolean;
  target?: string;
  description?: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateFrontmatter(name: string, tools: ToolInfo[], customDescription?: string): Promise<string> {
  const toolNames = tools.map((t) => t.name).join(", ");
  return renderTemplate("skill-frontmatter", {
    name,
    toolNames,
    toolCount: tools.length,
    customDescription
  });
}

interface ToolParam {
  key: string;
  type: string;
  required: boolean;
  description: string;
}

async function generateToolSection(tool: ToolInfo): Promise<string> {
  const props = tool.inputSchema?.properties as Record<string, { type?: string; description?: string }> | undefined;
  const requiredKeys = (tool.inputSchema?.required as string[]) || [];

  const params: ToolParam[] = props
    ? Object.entries(props).map(([key, value]) => ({
        key,
        type: value.type || "unknown",
        required: requiredKeys.includes(key),
        description: value.description || ""
      }))
    : [];

  return renderTemplate("tool-section", {
    name: tool.name,
    description: tool.description || "(No description)",
    params,
    slug: slugify(tool.name)
  });
}

async function generateSkillMd(name: string, tools: ToolInfo[], withScript?: boolean, customDescription?: string): Promise<string> {
  const frontmatter = await generateFrontmatter(name, tools, customDescription);
  const toolSections = (await Promise.all(tools.map(generateToolSection))).join("\n");
  const scriptDocs = withScript ? await generateScriptDocumentation(tools) : "";

  return renderTemplate("skill-md", {
    frontmatter,
    name,
    toolSections,
    scriptDocs
  });
}

async function generateToolReference(tool: ToolInfo): Promise<string> {
  return renderTemplate("tool-reference", {
    name: tool.name,
    description: tool.description || "(No description)",
    schemaJson: JSON.stringify(tool.inputSchema, null, 2)
  });
}

export async function generateSkill(options: GeneratorOptions): Promise<void> {
  const { name, outputDir, tools, withScript, target, description } = options;

  await mkdir(outputDir, { recursive: true });
  await mkdir(join(outputDir, "references", "tools"), { recursive: true });

  const skillMd = await generateSkillMd(name, tools, withScript, description);
  await writeFile(join(outputDir, "SKILL.md"), skillMd);

  for (const tool of tools) {
    const ref = await generateToolReference(tool);
    await writeFile(
      join(outputDir, "references", "tools", `${slugify(tool.name)}.md`),
      ref
    );
  }

  if (withScript && target) {
    await mkdir(join(outputDir, "scripts"), { recursive: true });
    await writeFile(
      join(outputDir, "scripts", "call-tool.js"),
      await generateCallToolScript(target)
    );
    await writeFile(
      join(outputDir, "scripts", "mcp-client.js"),
      generateMcpClientScript()
    );
  }
}
