export const multiFileQuestions = [
  {
    type: 'confirm',
    name: 'enableMultiFile',
    message: 'Enable multi-file context linking (e.g., project-notes.md, todo-list.md)?',
    default: true
  },
  {
    type: 'checkbox',
    name: 'linkedFiles',
    message: 'Select additional context files to generate:',
    choices: [
      'claude-md-preferences.md',
      'project-notes.md',
      'todo-list.md',
      'mixed-with-code.md'
    ],
    when: (answers) => answers.enableMultiFile
  }
];
