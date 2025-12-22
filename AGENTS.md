Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

# Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { it, expect } from "bun:test";

it("behaves as expected", () => {
  expect(1).toBe(1);
});
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.

Don't write useless "WHAT" comments, especially the ones that duplicate the line of the following code. "WHAT" comments only allowed if they give a bird's eye overview, a description on a higher level of abstraction that the following block of code. Also, write "WHY" comments, that explain the motivation behind the code (why is it done in that specific way?), explain an especially complex or tricky part of the code.
