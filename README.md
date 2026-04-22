# sarahinit

sarahinit is an AI agent skill initializer.
It prepares agent instruction/config files in your project so your AI assistants work with the same project rules.

## What This Project Is

- A CLI tool to initialize and update AI agent configuration files.
- A smart detector that finds existing agent files in your workspace.
- A generator that writes structured context for each selected agent.

## Supported Agents

- Claude Code
- Cursor
- GitHub Copilot
- Windsurf
- Cline
- Codex
- Gemini CLI
- Continue
- Zed

## Installation

### Run directly

```bash
npx @sarahinit/sarahinit
```

### Local development install

```bash
npm install
```

## How To Use

### First time setup

```bash
npx @sarahinit/sarahinit
```

### Update existing generated sections

```bash
npx @sarahinit/sarahinit --update
```

After global installation, the CLI command remains:

```bash
sarahinit
```

## How The Agent Works

1. Scans workspace files to detect which AI agent configs already exist.
2. Asks interactive questions about stack, design style, and workflow.
3. Generates or updates native config files for each selected agent.
4. Preserves manual content outside managed context blocks.
5. Optionally generates linked context files and benchmark notes.

## Why Use It

- Keep all AI coding agents aligned with one project standard.
- Avoid repeating the same setup instructions in every tool.
- Make updates fast with one command.
