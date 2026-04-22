import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET_FILE = 'sarahinit.instructions.md';

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getPromptDirectories() {
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

async function readSkillTemplate() {
  const templatePath = new URL('../skills/sarahinit.instructions.md', import.meta.url);
  return fs.readFile(templatePath, 'utf-8');
}

export async function installGlobalSkill({ force = false, silent = true } = {}) {
  const promptDirs = getPromptDirectories();
  const template = await readSkillTemplate();

  for (const dir of promptDirs) {
    await fs.mkdir(dir, { recursive: true });
    const destination = path.join(dir, TARGET_FILE);

    if (!force) {
      try {
        const existing = await fs.readFile(destination, 'utf-8');
        if (existing === template) {
          continue;
        }
      } catch {
        // Destination file does not exist yet.
      }
    }

    await fs.writeFile(destination, template, 'utf-8');
  }

  if (!silent) {
    // Output only in verbose mode.
    process.stdout.write(`sarahinit skill installed to ${promptDirs.length} prompt directories\n`);
  }
}

const isDirectExecution = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '');
if (isDirectExecution) {
  installGlobalSkill({ force: false, silent: true }).catch(() => {
    process.exit(1);
  });
}
