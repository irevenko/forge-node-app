const questions = [
  {
    type: 'text',
    message: '📝 Enter project name:',
    name: 'projectName',
    default: 'node-project',
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
