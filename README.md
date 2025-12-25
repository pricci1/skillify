# skillify

Pack MCP (Model Context Protocol) servers into Claude Skills.

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

#### Options

- `-o, --output <dir>` - Output directory (default: `./<skill-name>`)
- `-n, --name <name>` - Skill name (default: MCP server name or `mcp-skill`)
- `-d, --description <description>` - Custom skill description (overrides auto-generated description)
- `-m, --message <message>` - Custom message to display after title in SKILL.md
- `--include <tools>` - Comma-separated list of tools to include
- `--exclude <tools>` - Comma-separated list of tools to exclude
- `--all` - Include all tools without prompting

## Output

Generates an [Agent Skills](https://agentskills.io/specification) compliant directory:

```
my-skill/
├── SKILL.md
└── references/
    └── tools/
        ├── tool-one.md
        └── tool-two.md
```
