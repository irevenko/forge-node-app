const questions = [
  {
    type: 'list',
    message: 'Pick the package manager:',
    name: 'pkgManager',
    choices: ['npm', 'yarn'],
  },
  {
    type: 'checkbox',
    message: 'Pick the config:',
    name: 'config',
    choices: ['ESLint', 'Prettier', 'Unit Tests', 'E2E Tests'],
  },
  {
    type: 'list',
    message: 'Does you project use TypeScript?',
    name: 'typescript',
    choices: ['Yes', 'No'],
  },
];

module.exports = {
  questions,
};
