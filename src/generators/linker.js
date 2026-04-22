import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';

export async function generateLinkedFiles(context, cwd) {
  const files = context.multiFile?.linkedFiles || [];

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

    if (!content) {
      continue;
    }

    const filePath = path.join(cwd, fileName);
    await fs.writeFile(filePath, content, 'utf-8');
    logger.success(`Generated ${fileName}`);
  }
}
