import { Command } from "commander";
import { connectToMCP } from "./client";
import { introspect } from "./introspect";
import { filterTools } from "./filter";
import { generateSkill } from "./generator";

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
      try {
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
      } catch (error) {
        console.error(
          `Error: ${error instanceof Error ? error.message : error}`
        );
        process.exit(1);
      }
    });

  program
    .command("pack <target>")
    .description("Pack an MCP server into a Claude Skill")
    .option("-o, --output <dir>", "Output directory")
    .option("-n, --name <name>", "Skill name")
    .option("-d, --description <description>", "Skill description")
    .option("-m, --message <message>", "Custom message to display after title")
    .option("--include <tools>", "Comma-separated tools to include")
    .option("--exclude <tools>", "Comma-separated tools to exclude")
    .option("--all", "Include all tools without prompting")
    .action(async (target: string, options) => {
      try {
        console.log(`Connecting to: ${target}`);
        const { client, close } = await connectToMCP(target);

        try {
          const info = await introspect(client);
          console.log(
            `Found ${info.tools.length} tools, ${info.prompts.length} prompts`
          );

          const selectedTools = await filterTools(info.tools, {
            include: options.include,
            exclude: options.exclude,
            all: options.all,
          });

          if (selectedTools.length === 0) {
            console.log("No tools selected. Exiting.");
            return;
          }

          const skillName = options.name || info.name || "mcp-skill";
          const outputDir = options.output || `./${skillName}`;

          console.log(`Generating skill: ${skillName}`);
          await generateSkill({
            name: skillName,
            outputDir,
            tools: selectedTools,
            prompts: info.prompts,
            withScript: true,
            target,
            description: options.description,
            message: options.message,
          });

          console.log(`✓ Skill generated at: ${outputDir}`);
        } finally {
          await close();
        }
      } catch (error) {
        console.error(
          `Error: ${error instanceof Error ? error.message : error}`
        );
        process.exit(1);
      }
    });

  return program;
}
