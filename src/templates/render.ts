import ejs from "ejs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function renderTemplate(name: string, data: Record<string, unknown>): Promise<string> {
  const templatePath = join(__dirname, `${name}.ejs`);
  const template = await Bun.file(templatePath).text();
  return ejs.render(template, data);
}
