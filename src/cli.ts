import { Command } from "commander";

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
      console.log(`Listing tools from: ${target}`);
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
