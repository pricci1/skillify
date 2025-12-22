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

# Filter tools
skillify pack "..." --include tool1,tool2
skillify pack "..." --exclude tool3,tool4
```

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
