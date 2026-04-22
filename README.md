# sarahinit

Universal AI agent configuration initializer for modern coding assistants.

## What It Does

- Detects which AI coding agents are already in your project.
- Runs an interactive setup wizard for project standards.
- Generates or updates native config files for Claude, Cursor, Copilot, Windsurf, Cline, Codex, Gemini, Continue, and Zed.
- Preserves user-authored content outside managed blocks.
- Optionally creates linked context files and a benchmark library.

## Requirements

- Node.js 18 or newer

## Install Dependencies

```bash
npm install
```

## Usage

```bash
npx sarahinit
```

Update existing managed sections:

```bash
npx sarahinit --update
```

The wizard auto-detects known agent configuration files in the current workspace and uses those agents automatically. If no known files exist, it asks which agents to configure.

## Development

```bash
npm install
node bin/cli.js
```

## Local Validation Scenarios

1. Clean folder: run the CLI and choose multiple agents.
2. Existing config: create a config file with manual notes, rerun with update mode, confirm only managed block changes.
3. Multi-file mode: enable linked files and verify auxiliary files are generated.
4. Benchmarks mode: opt in and verify benchmarks.md is generated.
