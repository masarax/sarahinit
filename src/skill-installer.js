import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_FILE_NAME = 'sarahinit.instructions.md';

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getCopilotPromptDirectories() {
  const envPromptDir = process.env.VSCODE_USER_PROMPTS_FOLDER;
  const appData = process.env.APPDATA;
  const home = os.homedir();

  return unique([
    envPromptDir,
    appData ? path.join(appData, 'Code', 'User', 'prompts') : '',
    appData ? path.join(appData, 'Code - Insiders', 'User', 'prompts') : '',
    path.join(home, '.config', 'Code', 'User', 'prompts'),
    path.join(home, '.config', 'Code - Insiders', 'User', 'prompts')
  ]);
}

function getAgentTargets() {
  const home = os.homedir();
  const copilotPromptDirs = getCopilotPromptDirectories();

  return {
    claude: [
      path.join(home, '.claude', 'instructions.md'),
      path.join(home, 'CLAUDE.md')
    ],
    cursor: [
      path.join(home, '.cursor', 'rules', 'sarahinit.mdc'),
      path.join(home, '.cursorrules')
    ],
    copilot: copilotPromptDirs.map((dir) => path.join(dir, SKILL_FILE_NAME)),
    windsurf: [
      path.join(home, '.windsurfrules')
    ],
    cline: [
      path.join(home, '.clinerules'),
      path.join(home, '.cline', 'rules.md')
    ],
    codex: [
      path.join(home, '.codex', 'instructions.md'),
      path.join(home, 'CODEX.md')
    ],
    gemini: [
      path.join(home, '.gemini', 'config.md'),
      path.join(home, 'GEMINI.md')
    ],
    continue: [
      path.join(home, '.continuerules')
    ],
    zed: [
      path.join(home, '.zed', 'instructions.md')
    ]
  };
}

async function readSkillTemplate() {
  const templatePath = new URL('../skills/sarahinit.instructions.md', import.meta.url);
  return fs.readFile(templatePath, 'utf-8');
}

function renderAgentSkill(agentName, filePath, template) {
  return [
    `# Sarahinit Skill Profile For ${agentName}`,
    '',
    `Target File: ${filePath}`,
    `Updated By: sarahinit`,
    '',
    '## AI GENERATED CONTEXT',
    template,
    '## END AI GENERATED CONTEXT',
    ''
  ].join('\n');
}

export async function installGlobalSkill({ force = false, silent = true } = {}) {
  const template = await readSkillTemplate();
  const targets = getAgentTargets();
  let writeCount = 0;

  for (const [agent, paths] of Object.entries(targets)) {
    for (const destination of unique(paths)) {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      const content = renderAgentSkill(agent, destination, template);

      if (!force) {
        try {
          const existing = await fs.readFile(destination, 'utf-8');
          if (existing === content) {
            continue;
          }
        } catch {
          // Destination file does not exist yet.
        }
      }

      await fs.writeFile(destination, content, 'utf-8');
      writeCount += 1;
    }
  }

  if (!silent) {
    process.stdout.write(`sarahinit skill updated ${writeCount} agent target files\n`);
  }
}

const isDirectExecution = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '');
if (isDirectExecution) {
  installGlobalSkill({ force: false, silent: true }).catch(() => {
    process.exit(1);
  });
}
