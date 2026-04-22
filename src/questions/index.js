import { validateContext } from '../utils/validator.js';
import { logger } from '../utils/logger.js';

const AGENT_CHOICES = ['claude', 'cursor', 'copilot', 'windsurf', 'cline', 'codex', 'gemini', 'continue', 'zed'];

const DEFAULT_TECH = {
  framework: 'Other',
  language: 'TypeScript',
  uiLibrary: 'None',
  packageManager: 'npm'
};

const DEFAULT_DESIGN = {
  spacing: 'normal (p-4)',
  useFramerMotion: false,
  componentStyle: 'Functional explicit'
};

const DEFAULT_WORKFLOW = {
  testing: false,
  linting: []
};

const DEFAULT_MULTI_FILE = {
  enableMultiFile: true,
  linkedFiles: ['project-notes.md', 'todo-list.md']
};

function createBootstrapContext(agents) {
  return {
    tech: { ...DEFAULT_TECH },
    design: { ...DEFAULT_DESIGN },
    workflow: { ...DEFAULT_WORKFLOW },
    agents: [...new Set(agents)],
    multiFile: {
      enableMultiFile: DEFAULT_MULTI_FILE.enableMultiFile,
      linkedFiles: [...DEFAULT_MULTI_FILE.linkedFiles]
    },
    benchmarks: false,
    timestamp: new Date().toISOString()
  };
}

export async function runWizard(existingAgents = [], updateMode = false, cwd = process.cwd()) {
  void existingAgents;
  void cwd;

  if (updateMode) {
    logger.info('Update mode: refreshing Sarah skill pack for all supported agents.');
  } else {
    logger.info('Applying Sarah skill pack for all supported AI agents.');
  }

  const context = createBootstrapContext(AGENT_CHOICES);
  validateContext(context);
  return context;
}
