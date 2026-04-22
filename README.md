# sarahinit

sarahinit is a global AI skill installer.

It installs a professional autonomous skill contract so AI agents can follow the same execution style across any workspace.

## What It Does

- Installs agent-specific global skill files for major AI coding agents
- Enables autonomous, professional task execution behavior in AI chats
- Focuses on low-token, high-quality implementation style
- Supports refresh updates through the same package

## Agent Target Files

sarahinit writes skill content to standard per-agent locations:

- Claude: ~/.claude/instructions.md and ~/CLAUDE.md
- Cursor: ~/.cursor/rules/sarahinit.mdc and ~/.cursorrules
- GitHub Copilot: VS Code prompts folder -> sarahinit.instructions.md
- Windsurf: ~/.windsurfrules
- Cline: ~/.clinerules and ~/.cline/rules.md
- Codex: ~/.codex/instructions.md and ~/CODEX.md
- Gemini CLI: ~/.gemini/config.md and ~/GEMINI.md
- Continue: ~/.continuerules
- Zed: ~/.zed/instructions.md

## Usage

Install or refresh global skill silently:

```bash
npx sarahinit
```

Force refresh the installed skill file:

```bash
npx sarahinit --update
```

## Package Update

```bash
pnpm up sarahinit
```

Then refresh:

```bash
npx sarahinit --update
```

## Skill Behavior

The installed global skill contract enforces:

- Autonomous execution for normal safe tasks
- Todo planning for multi-step work
- Minimal and reviewable code changes
- Validation/testing after meaningful edits
- Concise and professional communication
- Questions only when requirements are ambiguous or risky
