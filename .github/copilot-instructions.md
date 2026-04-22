FULL UPDATED ROADMAP: sarahinit (AI Agent Skill Initializer)

Project Name: sarahinit
Description: Universal AI coding agent project initializer with multi-file context linking. Run via `npx sarahinit`. Interactively gathers project context and generates/updates native configuration files for every popular AI agent. The CLI automatically detects the current agent from the workspace files and configures it without unnecessary prompts.

Supported AI Agents and Their Configuration Files:
- Claude Code: CLAUDE.md (primary), .claude/instructions.md, claude-md-preferences.md, project-notes.md, todo-list.md
- Cursor: .cursorrules (primary), .cursor/rules/*.mdc
- GitHub Copilot: .github/copilot-instructions.md
- Windsurf: .windsurfrules
- Cline: .clinerules, .cline/rules.md
- Codex: CODEX.md, .codex/instructions.md
- Gemini CLI: GEMINI.md, .gemini/config.md
- Continue (VSCode): .continuerules
- Zed: .zed/instructions.md
- Any other: Auto-detected via workspace files or manual selection.

Multi-File Linking Strategy:
The CLI creates a primary config file and optionally secondary files. All files are cross-linked via HTML/Markdown comments.
Example for Claude Code:
- CLAUDE.md (main instructions, contains links to other files)
- claude-md-preferences.md (coding style, personal preferences)
- project-notes.md (architecture decisions, domain knowledge)
- todo-list.md (current tasks, priority order)

Linking syntax: <!-- See also: claude-md-preferences.md -->

Optional Benchmark Module:
If user opts in, generate benchmarks.md with common tasks and expected approaches.
Benchmark topics:
- Explain React re-render bug
- Fix auth middleware token expiry
- Set up PostgreSQL connection pool
- Explain git rebase vs merge
- Refactor callback to async/await
- Architecture: microservices vs monolith
- Review PR for security issues
- Docker multi-stage build
- Debug PostgreSQL race condition
- Implement React error boundary

Phase 1: Research and Architecture (1-2 hours)

1.1 Target Agent Configuration Mapping (Extended)

Agent Name        Primary Config                  Secondary / Linked Files                     Auto-Detect Pattern (workspace files)
----------------------------------------------------------------------------------------------------------------------
Claude Code       CLAUDE.md                      .claude/instructions.md, claude-md-*.md       CLAUDE.md or .claude/ exists
Cursor            .cursorrules                   .cursor/rules/*.mdc                           .cursorrules or .cursor/ exists
GitHub Copilot    .github/copilot-instructions.md (none)                                       .github/copilot-instructions.md exists
Windsurf          .windsurfrules                 (none)                                        .windsurfrules exists
Cline             .clinerules                    .cline/rules.md                               .clinerules exists
Codex             CODEX.md                       .codex/instructions.md                        CODEX.md exists
Gemini CLI        GEMINI.md                      .gemini/config.md                             GEMINI.md exists
Continue          .continuerules                 (none)                                        .continuerules exists
Zed               .zed/instructions.md           (none)                                        .zed/ exists
Other             (user specified)               (user specified)                              manual input

1.2 Technology Stack for CLI
- Runtime: Node.js >=18
- CLI Framework: Inquirer.js v9+
- Templating: Handlebars
- File Utilities: fs-extra
- Styling: Chalk
- Argument Parsing: Node.js util.parseArgs
- Binary Entry: package.json bin field

Phase 2: Repository Structure Setup (1 hour)

Directory Tree:
sarahinit/
├── .github/
│   └── copilot-instructions.md
├── bin/
│   └── cli.js
├── src/
│   ├── prompts/
│   │   ├── base-context.hbs
│   │   └── agent-specific/
│   │       ├── claude.hbs
│   │       ├── cursor.hbs
│   │       ├── copilot.hbs
│   │       ├── windsurf.hbs
│   │       ├── cline.hbs
│   │       ├── codex.hbs
│   │       ├── gemini.hbs
│   │       ├── continue.hbs
│   │       └── zed.hbs
│   ├── questions/
│   │   ├── index.js
│   │   ├── tech-stack.js
│   │   ├── design-system.js
│   │   ├── workflow.js
│   │   ├── multi-file.js
│   │   └── benchmark-opt.js
│   ├── generators/
│   │   ├── detector.js
│   │   ├── writer.js
│   │   ├── merger.js
│   │   └── linker.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── security.js
│   │   └── validator.js
│   └── index.js
├── templates/
├── .github/workflows/
│   └── publish.yml
├── package.json
└── README.md

package.json Content:
{
  "name": "sarahinit",
  "version": "1.0.0",
  "description": "Universal AI coding agent project initializer with multi-file context linking",
  "bin": { "sarahinit": "./bin/cli.js" },
  "main": "src/index.js",
  "type": "module",
  "scripts": { "start": "node bin/cli.js" },
  "keywords": ["ai", "cursor", "claude", "copilot", "windsurf", "cline", "codex", "gemini", "continue", "zed", "sarah"],
  "author": "masarax",
  "license": "MIT",
  "dependencies": {
    "chalk": "^5.3.0",
    "fs-extra": "^11.2.0",
    "handlebars": "^4.7.8",
    "inquirer": "^9.2.12"
  },
  "engines": { "node": ">=18.0.0" }
}

Phase 3: Core CLI Development

3.1 Entry Point (bin/cli.js)

#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { main } from '../src/index.js';

const { values } = parseArgs({
  options: {
    update: { type: 'boolean', short: 'u' }
  }
});

main({ updateMode: values.update }).catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});

3.2 Main Orchestrator (src/index.js)

import chalk from 'chalk';
import { runWizard } from './questions/index.js';
import { detectAllAgents } from './generators/detector.js';
import { generateAllConfigs } from './generators/writer.js';
import { logger } from './utils/logger.js';

export async function main({ updateMode = false }) {
  console.log(chalk.bold.cyan('\n🚀 sarahinit - Universal AI Agent Skill Initializer\n'));
  
  const cwd = process.cwd();
  const detectedAgents = await detectAllAgents(cwd);
  logger.info(`Detected agents from workspace: ${detectedAgents.join(', ') || 'none'}`);
  
  const userContext = await runWizard(detectedAgents, updateMode);
  
  await generateAllConfigs(userContext, cwd);
  
  console.log(chalk.green('\n✅ All agent configurations updated successfully!'));
  console.log(chalk.gray('Run `npx sarahinit --update` to modify settings later.'));
}

3.3 Agent Detector (src/generators/detector.js)

import fs from 'fs-extra';
import path from 'path';

const AGENT_PATTERNS = [
  { name: 'claude', files: ['CLAUDE.md', '.claude'] },
  { name: 'cursor', files: ['.cursorrules', '.cursor'] },
  { name: 'copilot', files: ['.github/copilot-instructions.md'] },
  { name: 'windsurf', files: ['.windsurfrules'] },
  { name: 'cline', files: ['.clinerules', '.cline'] },
  { name: 'codex', files: ['CODEX.md', '.codex'] },
  { name: 'gemini', files: ['GEMINI.md', '.gemini'] },
  { name: 'continue', files: ['.continuerules'] },
  { name: 'zed', files: ['.zed'] }
];

export async function detectAllAgents(cwd) {
  const detected = [];
  for (const agent of AGENT_PATTERNS) {
    for (const file of agent.files) {
      const filePath = path.join(cwd, file);
      if (await fs.pathExists(filePath)) {
        detected.push(agent.name);
        break;
      }
    }
  }
  return [...new Set(detected)];
}

3.4 Interactive Wizard (src/questions/index.js)

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';

async function detectCurrentAgent(cwd) {
  // Check workspace files (the most reliable method inside an agent environment)
  if (await fs.pathExists(path.join(cwd, '.cursorrules'))) return 'cursor';
  if (await fs.pathExists(path.join(cwd, '.cursor'))) return 'cursor';
  if (await fs.pathExists(path.join(cwd, 'CLAUDE.md'))) return 'claude';
  if (await fs.pathExists(path.join(cwd, '.claude'))) return 'claude';
  if (await fs.pathExists(path.join(cwd, '.windsurfrules'))) return 'windsurf';
  if (await fs.pathExists(path.join(cwd, '.github/copilot-instructions.md'))) return 'copilot';
  if (await fs.pathExists(path.join(cwd, '.clinerules'))) return 'cline';
  if (await fs.pathExists(path.join(cwd, 'CODEX.md'))) return 'codex';
  if (await fs.pathExists(path.join(cwd, 'GEMINI.md'))) return 'gemini';
  if (await fs.pathExists(path.join(cwd, '.continuerules'))) return 'continue';
  if (await fs.pathExists(path.join(cwd, '.zed'))) return 'zed';
  return null;
}

export async function runWizard(existingAgents, updateMode) {
  console.log('📋 Please answer the following questions to configure all AI agents.\n');
  
  const context = {};
  
  // Tech Stack
  context.tech = await inquirer.prompt([
    { type: 'list', name: 'framework', message: 'Framework:', choices: ['Next.js (App Router)', 'Next.js (Pages)', 'Vite + React', 'Vue', 'Laravel', 'Other'] },
    { type: 'list', name: 'language', message: 'Language:', choices: ['TypeScript', 'JavaScript'] },
    { type: 'list', name: 'uiLibrary', message: 'UI Library:', choices: ['shadcn/ui', 'Material UI', 'Tailwind only', 'None'] },
    { type: 'list', name: 'packageManager', message: 'Package manager:', choices: ['npm', 'yarn', 'pnpm', 'bun'] }
  ]);
  
  // Design System
  context.design = await inquirer.prompt([
    { type: 'list', name: 'spacing', message: 'Spacing preference:', choices: ['compact (p-2)', 'normal (p-4)', 'spacious (p-6)'] },
    { type: 'confirm', name: 'useFramerMotion', message: 'Use Framer Motion?', default: true },
    { type: 'list', name: 'componentStyle', message: 'React component style:', choices: ['Functional explicit', 'Arrow implicit', 'Mixed'] }
  ]);
  
  // Workflow
  context.workflow = await inquirer.prompt([
    { type: 'confirm', name: 'testing', message: 'Write tests?', default: false },
    { type: 'checkbox', name: 'linting', message: 'Linting/formatting:', choices: ['ESLint', 'Prettier', 'Biome'] }
  ]);
  
  // Agent Selection - Smart detection without unnecessary questions
  const cwd = process.cwd();
  const currentAgent = await detectCurrentAgent(cwd);
  
  if (existingAgents.length === 0) {
    if (currentAgent) {
      context.agents = [currentAgent];
      logger.info(`🔍 Auto-detected you are using ${currentAgent}. Configuring for it.`);
      
      // Optionally add more agents
      const { addMore } = await inquirer.prompt([
        { type: 'confirm', name: 'addMore', message: 'Configure for additional agents?', default: false }
      ]);
      if (addMore) {
        const { selected } = await inquirer.prompt([
          { type: 'checkbox', name: 'selected', message: 'Select additional agents:', 
            choices: ['claude', 'cursor', 'copilot', 'windsurf', 'cline', 'codex', 'gemini', 'continue', 'zed'].filter(a => a !== currentAgent) }
        ]);
        context.agents = [...new Set([currentAgent, ...selected])];
      }
    } else {
      const agentAnswer = await inquirer.prompt([
        { type: 'checkbox', name: 'selected', message: 'Which agents do you use?', 
          choices: ['claude', 'cursor', 'copilot', 'windsurf', 'cline', 'codex', 'gemini', 'continue', 'zed'] }
      ]);
      context.agents = agentAnswer.selected;
    }
  } else {
    context.agents = existingAgents;
    logger.info(`Using existing agent configs: ${existingAgents.join(', ')}`);
  }
  
  // Multi-file linking preferences
  const multiFileAnswer = await inquirer.prompt([
    { type: 'confirm', name: 'enableMultiFile', message: 'Enable multi-file context linking (project-notes.md, todo-list.md)?', default: true },
    { type: 'checkbox', name: 'linkedFiles', message: 'Select additional context files:', 
      choices: ['claude-md-preferences.md', 'project-notes.md', 'todo-list.md', 'mixed-with-code.md'],
      when: (ans) => ans.enableMultiFile }
  ]);
  context.multiFile = multiFileAnswer;
  
  // Benchmark module opt-in
  const benchmarkAnswer = await inquirer.prompt([
    { type: 'confirm', name: 'enableBenchmarks', message: 'Generate benchmarks.md with common task solutions?', default: false }
  ]);
  context.benchmarks = benchmarkAnswer.enableBenchmarks;
  
  context.timestamp = new Date().toISOString();
  return context;
}

3.5 Base Context Template (src/prompts/base-context.hbs)

# PROJECT STANDARDS (Auto-generated by sarahinit)
# Last updated: {{timestamp}}
# This file is shared across all agent configs via links.

## Technical Stack
- Framework: {{tech.framework}}
- Language: {{tech.language}}
- UI Library: {{tech.uiLibrary}}
- Package Manager: {{tech.packageManager}}

## Design Guidelines
- Spacing: {{design.spacing}}
- Animations: {{#if design.useFramerMotion}}framer-motion{{else}}CSS transitions{{/if}}
- Component Style: {{design.componentStyle}}

## Workflow Rules
- Testing: {{#if workflow.testing}}Required{{else}}Not required{{/if}}
- Linting: {{workflow.linting}}

## Code Generation Rules
{{#if (eq tech.uiLibrary "shadcn/ui")}}
- Import shadcn components from `@/components/ui`.
- Use `cn()` utility from `@/lib/utils` for class merging.
- Prefer Tailwind CSS variables (`bg-background`, `text-foreground`).
- No custom CSS files.
{{/if}}
{{#if (eq tech.framework "Next.js (App Router)")}}
- Use 'use client' for client components.
- Prefer server components.
- Use `next/navigation` for routing.
{{/if}}

## Self-Update Instruction
<!-- AI_SKILL:UPDATE_TRIGGER -->
If the user provides new project standards, suggest running `npx sarahinit --update` or edit the managed sections.

3.6 Agent-Specific Template Example (src/prompts/agent-specific/claude.hbs)

[CLAUDE.md]
# CLAUDE.md - Project Context for Claude Code
<!-- This file is auto-managed. See also: claude-md-preferences.md, project-notes.md, todo-list.md -->

{{> base-context}}

## Claude Code Specific Capabilities
- Long context window: Feel free to include detailed documentation.
- Use `claude` CLI commands for advanced file operations.
- When generating code, prioritize readability and maintainability.

<!-- LINKED FILES -->
{{#if multiFile.enableMultiFile}}
Linked context files:
{{#each multiFile.linkedFiles}}
- [{{this}}](./{{this}})
{{/each}}
{{/if}}

(Similar enriched templates for all other agents should be created.)

3.7 Writer Module (src/generators/writer.js)

import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { logger } from '../utils/logger.js';
import { securityCheck } from '../utils/security.js';
import { generateLinkedFiles } from './linker.js';

const AGENT_CONFIG_MAP = {
  claude: { primary: 'CLAUDE.md', template: 'claude.hbs' },
  cursor: { primary: '.cursorrules', template: 'cursor.hbs' },
  copilot: { primary: '.github/copilot-instructions.md', template: 'copilot.hbs' },
  windsurf: { primary: '.windsurfrules', template: 'windsurf.hbs' },
  cline: { primary: '.clinerules', template: 'cline.hbs' },
  codex: { primary: 'CODEX.md', template: 'codex.hbs' },
  gemini: { primary: 'GEMINI.md', template: 'gemini.hbs' },
  continue: { primary: '.continuerules', template: 'continue.hbs' },
  zed: { primary: '.zed/instructions.md', template: 'zed.hbs' }
};

export async function generateAllConfigs(context, cwd) {
  securityCheck(context);
  
  // Load and compile base template as partial
  const baseTemplateContent = await fs.readFile(
    new URL('../prompts/base-context.hbs', import.meta.url),
    'utf-8'
  );
  Handlebars.registerPartial('base-context', baseTemplateContent);
  
  // Generate linked files first (if enabled)
  if (context.multiFile?.enableMultiFile) {
    await generateLinkedFiles(context, cwd);
  }
  
  // Generate benchmark file if opted in
  if (context.benchmarks) {
    await generateBenchmarkFile(context, cwd);
  }
  
  // Generate primary config for each selected agent
  for (const agent of context.agents) {
    const config = AGENT_CONFIG_MAP[agent];
    if (!config) continue;
    
    const templatePath = new URL(`../prompts/agent-specific/${config.template}`, import.meta.url);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    const output = template(context);
    
    const filePath = path.join(cwd, config.primary);
    await fs.ensureDir(path.dirname(filePath));
    
    // Merge with existing content (preserve user customizations outside managed block)
    let finalContent = output;
    if (await fs.pathExists(filePath)) {
      const existing = await fs.readFile(filePath, 'utf-8');
      finalContent = mergeConfigs(existing, output, agent);
    }
    
    await fs.writeFile(filePath, finalContent);
    logger.success(`Updated ${config.primary}`);
  }
}

function mergeConfigs(existing, generated, agent) {
  const startMarker = '## AI GENERATED CONTEXT';
  const endMarker = '## END AI GENERATED CONTEXT';
  const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'gm');
  const newBlock = `${startMarker}\n${generated}\n${endMarker}`;
  if (regex.test(existing)) {
    return existing.replace(regex, newBlock);
  } else {
    return existing + '\n\n' + newBlock;
  }
}

async function generateBenchmarkFile(context, cwd) {
  const benchmarks = [
    'Explain React re-render bug',
    'Fix auth middleware token expiry',
    'Set up PostgreSQL connection pool',
    'Explain git rebase vs merge',
    'Refactor callback to async/await',
    'Architecture: microservices vs monolith',
    'Review PR for security issues',
    'Docker multi-stage build',
    'Debug PostgreSQL race condition',
    'Implement React error boundary'
  ];
  const content = `# Benchmarks for AI Agents\n\nThis file provides common tasks and expected approaches. Agents can refer to it for guidance.\n\n${benchmarks.map((b, i) => `${i+1}. ${b}`).join('\n')}\n`;
  await fs.writeFile(path.join(cwd, 'benchmarks.md'), content);
  logger.success('Generated benchmarks.md');
}

3.8 Multi-File Linker (src/generators/linker.js)

export async function generateLinkedFiles(context, cwd) {
  const files = context.multiFile.linkedFiles || [];
  
  for (const fileName of files) {
    let content = '';
    if (fileName === 'claude-md-preferences.md') {
      content = '# Personal Coding Preferences\n\n- Indentation: 2 spaces\n- Quotes: single\n- Semicolons: yes\n';
    } else if (fileName === 'project-notes.md') {
      content = '# Project Notes\n\n- Architecture decisions go here.\n- Add domain knowledge as needed.\n';
    } else if (fileName === 'todo-list.md') {
      content = '# TODO List\n\n- [ ] Task 1\n- [ ] Task 2\n';
    } else if (fileName === 'mixed-with-code.md') {
      content = '# Mixed Notes\n\nCode snippets and documentation mixed.\n';
    }
    await fs.writeFile(path.join(cwd, fileName), content);
    logger.success(`Generated ${fileName}`);
  }
}

Phase 4: Self-Updating Mechanism

The generated config files contain the marker <!-- AI_SKILL:UPDATE_TRIGGER --> with instructions. When an agent reads the file, it recognizes that if project standards change, it should prompt the user to run `npx sarahinit --update`. The --update flag runs the wizard again and overwrites the AI GENERATED CONTEXT block while preserving user customizations outside it.

Phase 5: Testing and QA

Test Cases:
1. Clean directory with no configs -> run CLI, auto-detects current agent from workspace files -> verifies correct primary file created.
2. Existing .cursorrules with manual rules -> run CLI -> only AI GENERATED CONTEXT block updated, manual rules untouched.
3. Multi-file linking enabled -> verify linked files generated with correct content.
4. Benchmarks opt-in -> verify benchmarks.md created.
5. Update mode -> modify one answer, run --update -> verify only managed blocks change.
6. Security: input containing '../' or API key patterns -> CLI aborts with error.
7. Agent detection: workspace contains CLAUDE.md -> CLI auto-selects claude without asking.

Phase 6: CI/CD Workflow (.github/workflows/publish.yml)

name: Publish to npm

on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests (placeholder)
        run: echo "No tests yet"
      
      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

Phase 7: Publishing to npm

Steps:
1. npm login
2. npm publish --access public
3. Verify installation: npx sarahinit

Phase 8: Future Enhancements

- Preset saving/loading (e.g., "Next.js + shadcn + TypeScript" preset)
- MCP server integration (generate mcp.json)
- Visual diff before applying changes
- Multi-language questionnaire
- Opt-in usage analytics

Appendix: Sample Generated CLAUDE.md

<!-- CLAUDE.md -->
# CLAUDE.md - Project Context for Claude Code
<!-- This file is auto-managed. See also: claude-md-preferences.md, project-notes.md, todo-list.md -->

## AI GENERATED CONTENT
# PROJECT STANDARDS (Auto-generated by sarahinit)
# Last updated: 2025-01-15T12:00:00.000Z

## Technical Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- UI Library: shadcn/ui
- Package Manager: pnpm

## Design Guidelines
- Spacing: normal (p-4)
- Animations: framer-motion
- Component Style: Functional explicit

## Workflow Rules
- Testing: Required
- Linting: ESLint,Prettier

## Code Generation Rules
- Import shadcn components from `@/components/ui`.
- Use `cn()` utility from `@/lib/utils` for class merging.
- Prefer Tailwind CSS variables (`bg-background`, `text-foreground`).
- No custom CSS files.
- Use 'use client' for client components.
- Prefer server components.
- Use `next/navigation` for routing.

## Self-Update Instruction
<!-- AI_SKILL:UPDATE_TRIGGER -->
If the user provides new project standards, suggest running `npx sarahinit --update` or edit the managed sections.
## END AI GENERATED CONTEXT

## Claude Code Specific Capabilities
- Long context window: Feel free to include detailed documentation.
- Use `claude` CLI commands for advanced file operations.
- When generating code, prioritize readability and maintainability.

<!-- LINKED FILES -->
Linked context files:
- [claude-md-preferences.md](./claude-md-preferences.md)
- [project-notes.md](./project-notes.md)
- [todo-list.md](./todo-list.md)

END OF ROADMAP