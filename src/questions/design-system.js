export const designSystemQuestions = [
  {
    type: 'list',
    name: 'spacing',
    message: 'Spacing preference:',
    choices: ['compact (p-2)', 'normal (p-4)', 'spacious (p-6)']
  },
  {
    type: 'confirm',
    name: 'useFramerMotion',
    message: 'Use Framer Motion?',
    default: true
  },
  {
    type: 'list',
    name: 'componentStyle',
    message: 'React component style:',
    choices: ['Functional explicit', 'Arrow implicit', 'Mixed']
  }
];
