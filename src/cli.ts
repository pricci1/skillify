import { Command } from "commander";
import { connectToMCP } from "./client";
import { introspect } from "./introspect";

export function createCLI() {
  const program = new Command();

  program
    .name("skillify")
    .description("Pack MCP servers into Claude Skills")
    .version("0.1.0");

  program
    .command("list <target>")
    .description("List tools and prompts from an MCP server")
    .action(async (target: string) => {
      console.log(`Connecting to: ${target}`);
      const { client, close } = await connectToMCP(target);
      try {
        const info = await introspect(client);
        console.log(`\nTools (${info.tools.length}):`);
        for (const tool of info.tools) {
          console.log(`  - ${tool.name}: ${tool.description || "(no description)"}`);
        }
        console.log(`\nPrompts (${info.prompts.length}):`);
        for (const prompt of info.prompts) {
          console.log(`  - ${prompt.name}: ${prompt.description || "(no description)"}`);
        }
      } finally {
        await close();
      }
    });

  program
    .command("pack <target>")
    .description("Pack an MCP server into a Claude Skill")
    .option("-o, --output <dir>", "Output directory")
    .option("-n, --name <name>", "Skill name")
    .option("--include <tools>", "Comma-separated tools to include")
    .option("--exclude <tools>", "Comma-separated tools to exclude")
    .option("--all", "Include all tools without prompting")
    .action(async (target: string, options) => {
      console.log(`Packing: ${target}`, options);
    });

  return program;
}
