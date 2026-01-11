export type ParsedTarget =
  | { type: "stdio"; command: string; args: string[] }
  | { type: "url"; url: string };

export function parseTarget(target: string): ParsedTarget {
  if (target.startsWith("http://") || target.startsWith("https://")) {
    return { type: "url", url: target };
  }

  const parts = target.split(/\s+/).filter(Boolean);
  return {
    type: "stdio",
    command: parts[0]!,
    args: parts.slice(1),
  };
}
