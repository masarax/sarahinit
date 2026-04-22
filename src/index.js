import chalk from 'chalk';
import { runWizard } from './questions/index.js';
import { generateAllConfigs } from './generators/writer.js';

export async function main({ updateMode = false }) {
  console.log(chalk.bold.cyan('\nSarahinit AI Skill Pack\n'));

  const cwd = process.cwd();
  const userContext = await runWizard([], updateMode, cwd);

  await generateAllConfigs(userContext, cwd);

  console.log(chalk.green('\nSarah skill pack applied successfully for all supported AI agents.'));
  console.log(chalk.gray('Run "npx sarahinit --update" to refresh generated sections.'));
}
