import { z } from "zod";

export const McpStdioConfigSchema = z.object({
  command: z.string(),
  args: z.array(z.string()),
  includeTools: z.array(z.string()).optional(),
});

export const McpUrlConfigSchema = z.object({
  url: z.string().url(),
  headers: z.record(z.string(), z.string()).optional(),
  includeTools: z.array(z.string()).optional(),
});

export const McpServerConfigSchema = z.union([
  McpStdioConfigSchema,
  McpUrlConfigSchema,
]);

export const McpJsonSchema = z.record(z.string(), McpServerConfigSchema);

export type McpStdioConfig = z.infer<typeof McpStdioConfigSchema>;
export type McpUrlConfig = z.infer<typeof McpUrlConfigSchema>;
export type McpServerConfig = z.infer<typeof McpServerConfigSchema>;
export type McpJson = z.infer<typeof McpJsonSchema>;
