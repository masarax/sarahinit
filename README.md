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
npx sarahinit
```

### Local development install

```bash
npm install
```

## How To Use

### First time setup

```bash
npx sarahinit
```

Default setup is non-interactive:

- If agent files are detected, it updates those agent configs automatically.
- If none are detected, it bootstraps all supported agent config files with a default skill profile.

### Update existing generated sections

```bash
npx sarahinit --update
```

Update mode is also non-interactive and refreshes managed sections using the current auto profile.

## How The Agent Works

1. Scans workspace files to detect which AI agent configs already exist.
2. By default, applies a profile automatically without blocking prompts.
3. In update mode, refreshes existing managed sections using the same auto profile.
4. Generates or updates native config files for each selected agent.
5. Preserves manual content outside managed context blocks.

## Why Use It

- Keep all AI coding agents aligned with one project standard.
- Avoid repeating the same setup instructions in every tool.
- Make updates fast with one command.
