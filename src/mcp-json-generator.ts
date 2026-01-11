import { parseTarget } from "./target-parser";
import type { McpJson, McpServerConfig } from "./mcp-json";

export interface McpJsonOptions {
  name: string;
  target: string;
  includeTools?: string[];
}

export function generateMcpJson(options: McpJsonOptions): McpJson {
  const { name, target, includeTools } = options;
  const parsed = parseTarget(target);
  const serverKey = `${name}-server`;

  let config: McpServerConfig;

  if (parsed.type === "url") {
    config = { url: parsed.url };
  } else {
    config = { command: parsed.command, args: parsed.args };
  }

  if (includeTools && includeTools.length > 0) {
    config.includeTools = includeTools;
  }

  return { [serverKey]: config };
}
