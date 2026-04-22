export const workflowQuestions = [
  {
    type: 'confirm',
    name: 'testing',
    message: 'Write tests?',
    default: false
  },
  {
    type: 'checkbox',
    name: 'linting',
    message: 'Linting/formatting:',
    choices: ['ESLint', 'Prettier', 'Biome']
  }
];
