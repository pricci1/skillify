import { parseTarget } from "./target-parser";
import type { McpJson } from "./mcp-json";

export interface McpJsonOptions {
  name: string;
  target: string;
  includeTools?: string[];
}

export function generateMcpJson(options: McpJsonOptions): McpJson {
  const { name, target, includeTools } = options;
  const { command, args } = parseTarget(target);
  const serverKey = `${name}-server`;

  const config: McpJson[string] = { command, args };

  if (includeTools && includeTools.length > 0) {
    config.includeTools = includeTools;
  }

  return { [serverKey]: config };
}
