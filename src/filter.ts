import { checkbox } from "@inquirer/prompts";
import type { ToolInfo } from "./introspect";

export interface FilterOptions {
  include?: string;
  exclude?: string;
  all?: boolean;
}

export async function filterTools(
  tools: ToolInfo[],
  options: FilterOptions
): Promise<ToolInfo[]> {
  if (options.all) {
    return tools;
  }

  if (options.include) {
    const included = new Set(options.include.split(",").map((s) => s.trim()));
    return tools.filter((t) => included.has(t.name));
  }

  if (options.exclude) {
    const excluded = new Set(options.exclude.split(",").map((s) => s.trim()));
    return tools.filter((t) => !excluded.has(t.name));
  }

  const selected = await checkbox({
    message: "Select tools to include:",
    choices: tools.map((t) => ({
      name: `${t.name} - ${t.description || "(no description)"}`,
      value: t.name,
      checked: true,
    })),
  });

  const selectedSet = new Set(selected);
  return tools.filter((t) => selectedSet.has(t.name));
}
