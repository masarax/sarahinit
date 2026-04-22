import inquirer from 'inquirer';
import { techStackQuestions } from './tech-stack.js';
import { designSystemQuestions } from './design-system.js';
import { workflowQuestions } from './workflow.js';
import { multiFileQuestions } from './multi-file.js';
import { benchmarkQuestions } from './benchmark-opt.js';
import { validateContext } from '../utils/validator.js';
import { detectAllAgents } from '../generators/detector.js';

const AGENT_CHOICES = ['claude', 'cursor', 'copilot', 'windsurf', 'cline', 'codex', 'gemini', 'continue', 'zed'];

function mergeUniqueAgents(existingAgents, workspaceAgents) {
  return [...new Set([...(existingAgents || []), ...(workspaceAgents || [])])];
}

export async function runWizard(existingAgents = [], updateMode = false, cwd = process.cwd()) {
  console.log('Please answer the following questions to configure all AI agents.\n');

  if (updateMode) {
    console.log('Update mode enabled. Existing managed blocks will be refreshed.\n');
  }

  const workspaceDetectedAgents = await detectAllAgents(cwd);
  const resolvedAgents = mergeUniqueAgents(existingAgents, workspaceDetectedAgents);

  if (resolvedAgents.length > 0) {
    console.log(`Auto-detected agent configs in workspace: ${resolvedAgents.join(', ')}\n`);
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
