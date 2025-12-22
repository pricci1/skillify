import type { ToolInfo } from "./introspect";

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
  return `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export interface MCPConnection {
  client: Client;
  close: () => Promise<void>;
}

function isUrl(target: string): boolean {
  return target.startsWith("http://") || target.startsWith("https://");
}

function parseCommand(target: string): { command: string; args: string[] } {
  const parts = target.split(/\\s+/).filter(Boolean);
  return { command: parts[0]!, args: parts.slice(1) };
}

export async function connectToMCP(target: string): Promise<MCPConnection> {
  const client = new Client({ name: "mcp-skill", version: "0.1.0" });

  if (isUrl(target)) {
    const url = new URL(target);
    let lastError: Error | null = null;

    try {
      const transport = new SSEClientTransport(url);
      await client.connect(transport);
      return { client, close: async () => await transport.close() };
    } catch (sseError) {
      lastError = sseError instanceof Error ? sseError : new Error(String(sseError));
    }

    try {
      const transport = new StreamableHTTPClientTransport(url);
      await client.connect(transport);
      return { client, close: async () => await transport.close() };
    } catch (httpError) {
      throw new Error(
        \`Failed with both SSE (\${lastError?.message}) and HTTP (\${
          httpError instanceof Error ? httpError.message : String(httpError)
        })\`
      );
    }
  } else {
    const { command, args } = parseCommand(target);
    const transport = new StdioClientTransport({ command, args });
    await client.connect(transport);
    return { client, close: async () => await transport.close() };
  }
}
`;
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
