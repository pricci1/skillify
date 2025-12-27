import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { getVersion } from '../version' with { type: "macro" };

export interface MCPConnection {
  client: Client;
  close: () => Promise<void>;
}

function isUrl(target: string): boolean {
  return target.startsWith("http://") || target.startsWith("https://");
}

function parseCommand(target: string): { command: string; args: string[] } {
  const parts = target.split(/\s+/).filter(Boolean);
  return { command: parts[0]!, args: parts.slice(1) };
}

export async function connectToMCP(target: string): Promise<MCPConnection> {
  const client = new Client({ name: "mcp-skill", version: getVersion() });

  if (isUrl(target)) {
    const url = new URL(target);
    let lastError: Error | undefined;

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
        `Failed with both SSE (${lastError?.message}) and HTTP (${
          httpError instanceof Error ? httpError.message : String(httpError)
        })`
      );
    }
  } else {
    const { command, args } = parseCommand(target);
    const transport = new StdioClientTransport({ command, args });
    await client.connect(transport);
    return { client, close: async () => await transport.close() };
  }
}
