import fs from 'fs';
import inquirer from 'inquirer';
import { IAnswers, IPresetAnswers } from './interfaces';
import ProjectGenerator from './classes/project_generator';

async function buildProject(): Promise<void> {
  const presets = ProjectGenerator.loadPresets();

  const presetAnswers: IPresetAnswers = await inquirer.prompt([
    {
      type: 'list',
      message: '💾 Pick the preset:',
      name: 'presetChoice',
      choices: [
        ...presets,
        'Default (yarn, TypeScript, ESLint (Errors only), Jest)',
        'Default (npm, JavaScript, ESLint (AirBNB), Mocha + Chai)',
        'Default (npm, Babel, ESLint (AirBNB), nodemon)',
        'Manualy select features',
      ],
    },
  ]);

  if (presetAnswers.presetChoice === 'Manualy select features') {
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
          name: 'extraLibs',
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
            return allAnswers.extraLibs.includes('Unit Tests');
          },
        },
        {
          type: 'list',
          message: '🔎 Pick ESLint config:',
          name: 'eslintConfig',
          choices: ['Only Errors', 'AirBNB', 'Google', 'Standard'],
          when(allAnswers): boolean {
            return allAnswers.extraLibs.includes('ESLint');
          },
        },
        {
          type: 'checkbox',
          message: '🎀 Pick the additional options:',
          name: 'extraOptions',
          choices: ['git', 'LICENSE', 'README'],
        },
        {
          type: 'list',
          message: '🏫 Choose the code hosting platform',
          name: 'hostingPlatform',
          choices: ['GitHub', 'GitLab'],
          when(allAnswers): boolean {
            return allAnswers.extraOptions.includes('git');
          },
        },
        {
          type: 'input',
          message: `🏫 Enter your GitHub or GitLab username`,
          name: 'platformUsername',
          when(allAnswers): boolean {
            return allAnswers.extraOptions.includes('git');
          },
        },
        {
          type: 'input',
          message: '🏫 Enter your repository name',
          name: 'repositoryName',
          when(allAnswers): boolean {
            return allAnswers.extraOptions.includes('git');
          },
        },
        {
          type: 'list',
          message: '📜 Choose the License type',
          name: 'licenseType',
          choices: ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC', 'GPL-3.0'],
          when(allAnswers): boolean {
            return allAnswers.extraOptions.includes('LICENSE');
          },
        },
        {
          type: 'input',
          message: '📜 Enter your name for the License',
          name: 'licenseAuthor',
          when(allAnswers): boolean {
            return allAnswers.extraOptions.includes('LICENSE');
          },
        },
        {
          type: 'confirm',
          message: '💾 Do you want to save this preset?',
          name: 'savePreset',
          default: false,
        },
        {
          type: 'input',
          message: '💾 Enter preset name:',
          name: 'presetName',
          when(allAnswers): boolean {
            return allAnswers.savePreset;
          },
        },
      ])
      .catch((error) => console.error(error));

    ProjectGenerator.handleProjectSettings(
      answers.projectName.trim(),
      answers.pkgManager,
      answers.pkgQuestions,
      answers.typeScript,
      answers.babel,
      answers.eslintConfig,
      answers.extraLibs,
      answers.extraOptions,
      answers.tests,
      answers.licenseType,
      answers.licenseAuthor,
      answers.hostingPlatform,
      answers.platformUsername,
      answers.repositoryName,
      answers.savePreset,
      answers.presetName
    );
  } else {
    // eslint-disable-next-line no-lonely-if
    if (
      presetAnswers.presetChoice ===
        'Default (yarn, TypeScript, ESLint (Errors only), Jest)' ||
      presetAnswers.presetChoice ===
        'Default (npm, JavaScript, ESLint (AirBNB), Mocha + Chai)' ||
      presetAnswers.presetChoice ===
        'Default (npm, Babel, ESLint (AirBNB), nodemon)'
    ) {
      ProjectGenerator.handleProjectWithDefaultPreset(
        presetAnswers.presetChoice
      );
    } else {
      ProjectGenerator.handleProjectWithCustomPreset(
        presetAnswers.presetChoice
      );
    }
  }
}

buildProject();
