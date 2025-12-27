import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { getVersion } from '../version';

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
  try {
    const client = new Client({ name: "skillify", version: getVersion() });

    if (isUrl(target)) {
      const url = new URL(target);
      let lastError: Error | null = null;

      try {
        const transport = new StreamableHTTPClientTransport(url);
        await client.connect(transport);
        return {
          client,
          close: async () => {
            await transport.close();
          },
        };
      } catch (httpError) {
        lastError = httpError instanceof Error ? httpError : new Error(String(httpError));
      }

      // Fall back to SSE (deprecated)
      try {
        const transport = new SSEClientTransport(url);
        await client.connect(transport);
        return {
          client,
          close: async () => {
            await transport.close();
          },
        };
      } catch (sseError) {
        throw new Error(
          `Failed with both HTTP (${lastError?.message}) and SSE (${
            sseError instanceof Error ? sseError.message : String(sseError)
          })`
        );
      }
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
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to connect to MCP server: ${error.message}`);
    }
    throw error;
  }
}
