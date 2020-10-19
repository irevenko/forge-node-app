/* eslint-disable prettier/prettier */
const questions = [
  {
    type: 'input',
    message: '📝 Enter project name:',
    name: 'projectName',
    validate(value) {
      const folderRules = new RegExp('^[a-z0-9\\_\\-]+$');

      if (value.startsWith('_') || value.startsWith('-') || value.endsWith('_') || value.endsWith('-')) {
        return 'Do not start or end with _ , -';
      }
      if (!value.match(folderRules)) {
        return 'Folder name can only contain Letters, Numbers, - and _';
      }

      return true;
    },
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
    name: 'typeScript',
    default: false,
  },
  {
    type: 'checkbox',
    message: '⚙️  Pick the config:',
    name: 'extraSettings',
    choices: [
      'ESLint',
      'Prettier',
      'dotenv',
      'nodemon',
      'Unit Tests',
    ],
  },
];

module.exports = {
  questions,
};
