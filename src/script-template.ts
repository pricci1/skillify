import type { ToolInfo } from "./introspect";
import { mcpClientBundled } from "./generated/mcp-client.bundled";

export function generateCallToolScript(target: string): string {
  return `#!/usr/bin/env bun
import { connectToMCP } from "./mcp-client.ts";

const TARGET = "${target}";

const [toolName, argsJson] = process.argv.slice(2);
if (!toolName) {
  console.error("Usage: call-tool.ts <tool-name> [args-json]");
  process.exit(1);
}

const args = argsJson ? JSON.parse(argsJson) : {};
const { client, close } = await connectToMCP(TARGET);

try {
  const result = await client.callTool({ name: toolName, arguments: args });
  console.log(JSON.stringify(result, null, 2));
} finally {
  await close();
}
`;
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

export function generateScriptDocumentation(tools: ToolInfo[]): string {
  const examples = tools.slice(0, 3).map((tool) => {
    const args = generateExampleArgs(tool);
    return `\`\`\`bash
bun scripts/call-tool.ts ${tool.name}${args}
\`\`\``;
  });

  return `
## Using the MCP Script

The skill includes executable scripts for calling MCP tools directly without Amp integration.

### Quick Start

\`\`\`bash
# List available tools
bun scripts/call-tool.ts --help

# Call a tool
${examples[0] || 'bun scripts/call-tool.ts <tool-name>'}
\`\`\`

### Examples

${examples.join("\n\n")}

### Scripts Included

- **scripts/call-tool.ts** - Executable script to call tools
- **scripts/mcp-client.ts** - MCP connection helper

The target MCP server is embedded in the script at generation time.
`;
}
