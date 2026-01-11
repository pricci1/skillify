export interface ParsedTarget {
  command: string;
  args: string[];
}

export function parseTarget(target: string): ParsedTarget {
  if (target.startsWith("http://") || target.startsWith("https://")) {
    throw new Error(
      "SSE transport is deprecated (MCP spec 2025-03-26). Use stdio or Streamable HTTP."
    );
  }

  const parts = target.split(/\s+/).filter(Boolean);
  return {
    command: parts[0]!,
    args: parts.slice(1),
  };
}
