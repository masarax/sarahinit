import inquirer from 'inquirer';
import { techStackQuestions } from './tech-stack.js';
import { designSystemQuestions } from './design-system.js';
import { workflowQuestions } from './workflow.js';
import { multiFileQuestions } from './multi-file.js';
import { benchmarkQuestions } from './benchmark-opt.js';
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

  if (!updateMode) {
    const bootstrapAgents = resolvedAgents.length > 0 ? resolvedAgents : AGENT_CHOICES;

    if (resolvedAgents.length > 0) {
      logger.info(`Auto-detected agent configs in workspace: ${resolvedAgents.join(', ')}`);
      logger.info('Applying default skill profile to detected agents. Use "npx sarahinit --update" for customization.');
    } else {
      logger.warn('No agent config files detected. Bootstrapping all supported agent rule files with a default profile.');
      logger.info('Run "npx sarahinit --update" to customize stack, design, and workflow settings later.');
    }

    const bootstrapContext = createBootstrapContext(bootstrapAgents);
    validateContext(bootstrapContext);
    return bootstrapContext;
  }

  console.log('Please answer the following questions to configure all AI agents.\n');

  if (updateMode) {
    console.log('Update mode enabled. Existing managed blocks will be refreshed.\n');
  }

  if (resolvedAgents.length > 0) {
    logger.info(`Auto-detected agent configs in workspace: ${resolvedAgents.join(', ')}`);
  }

  const context = {};

  context.tech = await inquirer.prompt(techStackQuestions);
  context.design = await inquirer.prompt(designSystemQuestions);
  context.workflow = await inquirer.prompt(workflowQuestions);

  if (resolvedAgents.length === 0) {
    const agentAnswer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Which agents do you use?',
        choices: AGENT_CHOICES
      }
    ]);

    context.agents = agentAnswer.selected.length > 0 ? agentAnswer.selected : ['copilot'];
  } else {
    context.agents = resolvedAgents;
  }

  context.multiFile = await inquirer.prompt(multiFileQuestions);

  const benchmarkAnswer = await inquirer.prompt(benchmarkQuestions);
  context.benchmarks = benchmarkAnswer.enableBenchmarks;

  context.timestamp = new Date().toISOString();

  validateContext(context);
  return context;
}
