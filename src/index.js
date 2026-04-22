import chalk from 'chalk';
import { runWizard } from './questions/index.js';
import { detectAllAgents } from './generators/detector.js';
import { generateAllConfigs } from './generators/writer.js';
import { logger } from './utils/logger.js';

export async function main({ updateMode = false }) {
  console.log(chalk.bold.cyan('\nUniversal AI Agent Skill Initializer\n'));

  const cwd = process.cwd();
  const detectedAgents = await detectAllAgents(cwd);
  logger.info(`Detected agents: ${detectedAgents.join(', ') || 'none'}`);

  const userContext = await runWizard(detectedAgents, updateMode, cwd);

  await generateAllConfigs(userContext, cwd);

  console.log(chalk.green('\nAll agent configurations updated successfully!'));
  console.log(chalk.gray('Run "npx sarahinit --update" to modify settings later.'));
}
