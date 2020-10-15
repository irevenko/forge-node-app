const questions = [
  {
    type: 'list',
    message: '🗂  Create new folder or continue in this',
    name: 'folderChoice',
    choices: ['Create new', 'Continue here'],
  },
  {
    type: 'text',
    message: '📝 Enter project name:',
    name: 'projectName',
    when: (a) => a.folderChoice === 'Create new',
  },
  {
    type: 'list',
    message: '📦 Pick the package manager:',
    name: 'pkgManager',
    choices: ['npm', 'yarn'],
  },
  {
    type: 'confirm',
    message: '🤓 Will you use TypeScript?',
    name: 'typescript',
    default: false,
  },
  {
    type: 'checkbox',
    message: '⚙️  Pick the config:',
    name: 'extraSettings',
    choices: [
      'ESLint',
      'Prettier',
      'Unit Tests',
      'E2E Tests',
      'dotenv',
      'nodemon',
    ],
  },
];

module.exports = {
  questions,
};
