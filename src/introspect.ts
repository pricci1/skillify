import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

export interface ToolInfo {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

export interface PromptInfo {
  name: string;
  description?: string;
  arguments?: Array<{ name: string; description?: string; required?: boolean }>;
}

export interface ServerInfo {
  name?: string;
  tools: ToolInfo[];
  prompts: PromptInfo[];
}

export async function introspect(client: Client): Promise<ServerInfo> {
  const [toolsResult, promptsResult] = await Promise.all([
    client.listTools().catch(() => ({ tools: [] })),
    client.listPrompts().catch(() => ({ prompts: [] })),
  ]);

  return {
    tools: toolsResult.tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema as Record<string, unknown>,
    })),
    prompts: promptsResult.prompts.map((p) => ({
      name: p.name,
      description: p.description,
      arguments: p.arguments,
    })),
  };
}
