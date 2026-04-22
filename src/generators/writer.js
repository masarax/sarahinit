import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { logger } from '../utils/logger.js';
import { securityCheck } from '../utils/security.js';
import { generateLinkedFiles } from './linker.js';
import { mergeConfigs } from './merger.js';

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

const SHARED_SKILL_FILE = 'sarah-skill.md';

const DEFAULT_BENCHMARKS = [
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

Handlebars.registerHelper('eq', (a, b) => a === b);

export async function generateAllConfigs(context, cwd) {
  securityCheck(context);

  await generateSharedSkillFile(context, cwd);

  const baseTemplateContent = await fs.readFile(
    new URL('../prompts/base-context.hbs', import.meta.url),
    'utf-8'
  );
  Handlebars.registerPartial('base-context', baseTemplateContent);

  if (context.multiFile?.enableMultiFile) {
    await generateLinkedFiles(context, cwd);
  }

  if (context.benchmarks) {
    await generateBenchmarkFile(cwd);
  }

  for (const agent of context.agents) {
    const config = AGENT_CONFIG_MAP[agent];
    if (!config) {
      continue;
    }

    const templatePath = new URL(`../prompts/agent-specific/${config.template}`, import.meta.url);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    const output = template(context);

    const filePath = path.join(cwd, config.primary);
    await fs.ensureDir(path.dirname(filePath));

    let finalContent = output;
    if (await fs.pathExists(filePath)) {
      const existing = await fs.readFile(filePath, 'utf-8');
      finalContent = mergeConfigs(existing, output);
    }

    await fs.writeFile(filePath, finalContent, 'utf-8');
    logger.success(`Updated ${config.primary}`);
  }
}

async function generateBenchmarkFile(cwd) {
  const templatePath = new URL('../prompts/benchmarks.hbs', import.meta.url);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  const benchmarks = DEFAULT_BENCHMARKS.map((item, index) => ({
    index: index + 1,
    item
  }));

  const content = template({ benchmarks });
  await fs.writeFile(path.join(cwd, 'benchmarks.md'), content, 'utf-8');
  logger.success('Generated benchmarks.md');
}

async function generateSharedSkillFile(context, cwd) {
  const generated = `# Sarah Skill Contract\n\nThis file defines the mandatory behavior for AI agents working in this project.\n\n## AI GENERATED CONTEXT\n- Source: sarahinit\n- Last Updated: ${context.timestamp}\n- Scope: All supported AI coding agents\n\n## Mandatory Rules\n1. Always prioritize project skill instructions over generic defaults.\n2. Keep changes focused, minimal, and aligned with existing project patterns.\n3. Preserve user-authored content outside managed generated blocks.\n4. When requirements are ambiguous, ask for clarification before risky changes.\n5. Prefer safe, reversible steps and verify outcomes after changes.\n\n## Enforcement Note\nAgent-specific files must reference and follow this contract.\n## END AI GENERATED CONTEXT\n`;

  const filePath = path.join(cwd, SHARED_SKILL_FILE);
  let finalContent = generated;

  if (await fs.pathExists(filePath)) {
    const existing = await fs.readFile(filePath, 'utf-8');
    finalContent = mergeConfigs(existing, generated);
  }

  await fs.writeFile(filePath, finalContent, 'utf-8');
  logger.success(`Updated ${SHARED_SKILL_FILE}`);
}
