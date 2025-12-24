import type { ToolInfo } from "./introspect";
import { mcpClientBundled } from "./generated/mcp-client.bundled";
import { renderTemplate } from "./templates/render";

export async function generateCallToolScript(target: string): Promise<string> {
  return renderTemplate("call-tool-script", { target });
}

export function generateMcpClientScript(): string {
  return mcpClientBundled;
}

function generateExampleArgs(tool: ToolInfo): string {
  const props = tool.inputSchema?.properties as Record<string, { type?: string }> | undefined;
  const required = (tool.inputSchema?.required as string[]) || [];

  if (!props || Object.keys(props).length === 0) {
    return "";
  }

  const exampleObj: Record<string, string> = {};
  for (const key of required.slice(0, 2)) {
    const prop = props[key];
    if (prop?.type === "string") {
      exampleObj[key] = `<${key}>`;
    } else if (prop?.type === "number") {
      exampleObj[key] = "0" as any;
    } else {
      exampleObj[key] = `<${key}>`;
    }
  }

  return Object.keys(exampleObj).length > 0 ? ` '${JSON.stringify(exampleObj)}'` : "";
}

export async function generateScriptDocumentation(tools: ToolInfo[]): Promise<string> {
  const examples = tools.slice(0, 3).map((tool) => {
    const args = generateExampleArgs(tool);
    return `bun scripts/call-tool.ts ${tool.name}${args}`;
  });
  return renderTemplate("script-documentation", { examples });
}
