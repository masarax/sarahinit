import fs from 'fs-extra';
import path from 'path';

const AGENT_PATTERNS = [
  { name: 'claude', files: ['CLAUDE.md', '.claude/instructions.md'] },
  { name: 'cursor', files: ['.cursorrules', '.cursor/rules'] },
  { name: 'copilot', files: ['.github/copilot-instructions.md'] },
  { name: 'windsurf', files: ['.windsurfrules'] },
  { name: 'cline', files: ['.clinerules', '.cline/rules.md'] },
  { name: 'codex', files: ['CODEX.md', '.codex/instructions.md'] },
  { name: 'gemini', files: ['GEMINI.md', '.gemini/config.md'] },
  { name: 'continue', files: ['.continuerules'] },
  { name: 'zed', files: ['.zed/instructions.md'] }
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
