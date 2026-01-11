import { z } from "zod";

export const McpServerConfigSchema = z.object({
  command: z.string(),
  args: z.array(z.string()),
  includeTools: z.array(z.string()).optional(),
});

export const McpJsonSchema = z.record(z.string(), McpServerConfigSchema);

export type McpServerConfig = z.infer<typeof McpServerConfigSchema>;
export type McpJson = z.infer<typeof McpJsonSchema>;
