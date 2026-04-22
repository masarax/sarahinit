export const techStackQuestions = [
  {
    type: 'list',
    name: 'framework',
    message: 'Framework:',
    choices: ['Next.js (App Router)', 'Next.js (Pages)', 'Vite + React', 'Vue', 'Laravel', 'Other']
  },
  {
    type: 'list',
    name: 'language',
    message: 'Language:',
    choices: ['TypeScript', 'JavaScript']
  },
  {
    type: 'list',
    name: 'uiLibrary',
    message: 'UI Library:',
    choices: ['shadcn/ui', 'Material UI', 'Tailwind only', 'None']
  },
  {
    type: 'list',
    name: 'packageManager',
    message: 'Package manager:',
    choices: ['npm', 'yarn', 'pnpm', 'bun']
  }
];
