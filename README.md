# skillify

Pack MCP (Model Context Protocol) servers into Agent Skills.

> [!NOTE]
> MCP servers can change their APIs freely because clients (LLMs) get the latest spec at runtime. Skillify breaks this model. It creates a snapshot of the server's API at generation time. This snapshot may not work with newer server versions.
>
> Maybe a future version will support a flag for dynamic.

## Installation

```bash
bun install
```

## Usage

### List tools from an MCP server

```bash
# stdio (spawn command)
skillify list "npx -y @modelcontextprotocol/server-memory"

# SSE (URL)
skillify list http://localhost:3000/sse
```

### Pack into a skill

```bash
# Interactive selection
skillify pack "npx -y @modelcontextprotocol/server-memory"

# Include all tools
skillify pack "node ./my-server.js" --all --name my-skill

# Custom description
skillify pack "..." --description "Custom skill description here"

# Custom message
skillify pack "..." --message "This message appears after the title"

# Filter tools
skillify pack "..." --include tool1,tool2
skillify pack "..." --exclude tool3,tool4
```

### Options

| Option | Description |
|--------|-------------|
| `-o, --output <dir>` | Output directory (default: `./<skill-name>`) |
| `-n, --name <name>` | Skill name (default: MCP server name or `mcp-skill`) |
| `-d, --description <desc>` | Custom skill description |
| `-m, --message <msg>` | Custom message after title in SKILL.md |
| `--include <tools>` | Comma-separated tools to include |
| `--exclude <tools>` | Comma-separated tools to exclude |
| `--all` | Include all tools without prompting |
| `--amp` | Generate Amp-native skill with `mcp.json` |
| `--pin-tools` | Force `includeTools` in `mcp.json` (requires `--amp --all`) |

## Output Format

### Standard Mode (default)

Generates an [Agent Skills](https://agentskills.io/specification) compliant directory:

```
my-skill/
├── SKILL.md
├── references/tools/
│   ├── tool-one.md
│   └── tool-two.md
└── scripts/
    ├── call-tool.js
    └── mcp-client.js
```

### Amp Mode (`--amp`)

Generates an [Amp](https://ampcode.com)-compatible skill with embedded MCP configuration:

```bash
skillify pack "npx -y @modelcontextprotocol/server-memory" --amp --name memory --all
```

```
my-skill/
├── SKILL.md
└── mcp.json
```

The `mcp.json` file specifies the MCP server command and optionally pins tools with `includeTools`.
