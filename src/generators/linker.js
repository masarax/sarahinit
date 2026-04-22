import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';

export async function generateLinkedFiles(context, cwd) {
  const files = context.multiFile?.linkedFiles || [];

  for (const fileName of files) {
    let content = '';

    if (fileName === 'claude-md-preferences.md') {
      content = '# Personal Coding Preferences\n\n- Indentation: 2 spaces\n- Quotes: single\n- Semicolons: yes\n- Response style: concise and action-oriented\n';
    } else if (fileName === 'project-notes.md') {
      content = '# Project Notes\n\n## Architecture\n- Record architecture decisions and rationale.\n\n## Domain Rules\n- Track business constraints and non-negotiable rules.\n\n## Current Focus\n- Keep current milestone and risks updated.\n';
    } else if (fileName === 'todo-list.md') {
      content = '# TODO List\n\n## In Progress\n- [ ] Add current active task\n\n## Next\n- [ ] Add next highest-impact task\n\n## Done\n- [ ] Move completed tasks here with date\n';
    } else if (fileName === 'mixed-with-code.md') {
      content = '# Mixed Notes\n\nCode snippets and documentation mixed.\n';
    }

    if (!content) {
      continue;
    }

    const filePath = path.join(cwd, fileName);
    if (await fs.pathExists(filePath)) {
      logger.info(`Kept existing ${fileName}`);
      continue;
    }

    await fs.writeFile(filePath, content, 'utf-8');
    logger.success(`Generated ${fileName}`);
  }
}
