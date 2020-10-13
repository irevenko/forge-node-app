const questions = [
  {
    type: 'list',
    message: 'Pick the package manager:',
    name: 'pkgManager',
    choices: ['npm', 'yarn'],
  },
  {
    type: 'list',
    message: 'Will you use TypeScript?',
    name: 'typescript',
    choices: ['Yes', 'No'],
  },
  {
    type: 'checkbox',
    message: 'Pick the config:',
    name: 'config',
    choices: ['ESLint', 'Prettier', 'Unit Tests', 'E2E Tests'],
  },
];

module.exports = {
  questions,
};
