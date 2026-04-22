import { validateContext } from '../utils/validator.js';
import { detectAllAgents } from '../generators/detector.js';
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

function mergeUniqueAgents(existingAgents, workspaceAgents) {
  return [...new Set([...(existingAgents || []), ...(workspaceAgents || [])])];
}

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
  const workspaceDetectedAgents = await detectAllAgents(cwd);
  const resolvedAgents = mergeUniqueAgents(existingAgents, workspaceDetectedAgents);
  const bootstrapAgents = resolvedAgents.length > 0 ? resolvedAgents : AGENT_CHOICES;

  if (resolvedAgents.length === 0) {
    logger.warn('No agent config files detected. Bootstrapping all supported agent rule files with a default profile.');
  } else {
    logger.info(`Applying skill refresh for detected agents: ${resolvedAgents.join(', ')}`);
  }

  if (updateMode) {
    logger.info('Update mode: refreshing managed sections with the current auto profile.');
  }

  const context = createBootstrapContext(bootstrapAgents);
  validateContext(context);
  return context;
}
