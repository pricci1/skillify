import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

export interface MCPConnection {
  client: Client;
  close: () => Promise<void>;
}

function isUrl(target: string): boolean {
  return target.startsWith("http://") || target.startsWith("https://");
}

function parseCommand(target: string): { command: string; args: string[] } {
  const parts = target.split(/\s+/);
  return { command: parts[0], args: parts.slice(1) };
}

export async function connectToMCP(target: string): Promise<MCPConnection> {
  const client = new Client({ name: "skillify", version: "0.1.0" });

  if (isUrl(target)) {
    const transport = new SSEClientTransport(new URL(target));
    await client.connect(transport);
    return {
      client,
      close: async () => {
        await transport.close();
      },
    };
  } else {
    const { command, args } = parseCommand(target);
    const transport = new StdioClientTransport({ command, args });
    await client.connect(transport);
    return {
      client,
      close: async () => {
        await transport.close();
      },
    };
  }
}
