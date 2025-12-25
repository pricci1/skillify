import ejs from "ejs";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function renderTemplate(name: string, data: Record<string, unknown>): Promise<string> {
  const templatePath = join(__dirname, `${name}.ejs`);
  const template = await readFile(templatePath, "utf-8");
  return ejs.render(template, data);
}
