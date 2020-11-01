import fs from 'fs';
import inquirer from 'inquirer';
import { IAnswers } from './interfaces';
import ProjectGenerator from './classes/project_generator';

async function buildProject(): Promise<void> {
  const answers: IAnswers = await inquirer
    .prompt([
      {
        type: 'input',
        message: '📝 Enter project name:',
        name: 'projectName',
        validate(value: string): boolean | string {
          const folderRules = new RegExp('^[a-z0-9\\_\\-]+$');

          if (fs.existsSync(value)) {
            return '📁 Directory already exists!';
          }

          if (
            value.startsWith('_') ||
            value.startsWith('-') ||
            value.endsWith('_') ||
            value.endsWith('-')
          ) {
            return '❌ Do not start or end with _ , -';
          }

          if (!value.match(folderRules)) {
            return '❌ Folder name can only contain Letters, Numbers, - and _';
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
        type: 'list',
        message: '📦 Do you want to answer package manager questions?',
        name: 'pkgQuestions',
        choices: ['Go with defaults', 'Answer questions'],
      },
      {
        type: 'confirm',
        message: '🤓 Will you use TypeScript?',
        name: 'typeScript',
        default: false,
      },
      {
        type: 'confirm',
        message: '🐠 Will you use Babel?',
        name: 'babel',
        default: false,
        when(allAnswers): boolean {
          return !allAnswers.typeScript;
        },
      },
      {
        type: 'checkbox',
        message: '⚙️  Pick the config:',
        name: 'extraSettings',
        choices: [
          'ESLint',
          'Prettier',
          'dotenv',
          'nodemon or ts-node-dev',
          'Unit Tests',
        ],
      },
      {
        type: 'list',
        message: '♻️  Pick the testing framework:',
        name: 'tests',
        choices: ['Jest', 'Mocha + Chai'],
        when(allAnswers): boolean {
          return allAnswers.extraSettings.includes('Unit Tests');
        },
      },
      {
        type: 'list',
        message: '🔎 Do you want to answer ESLint questions?',
        name: 'eslintQuestions',
        choices: ['Go with defaults', 'Answer questions'],
        when(allAnswers): boolean {
          return allAnswers.extraSettings.includes('ESLint');
        },
      },
    ])
    .catch((error) => console.error(error));

  ProjectGenerator.handleProjectSettings(
    answers.projectName.trim(),
    answers.pkgManager,
    answers.pkgQuestions,
    answers.eslintQuestions,
    answers.typeScript,
    answers.extraSettings,
    answers.tests
  );
}

buildProject();
