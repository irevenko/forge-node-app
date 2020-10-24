import inquirer from 'inquirer';
import questions from './questions';
import { IAnswers } from './interfaces';
import ProjectGenerator from './project_generator';

async function buildProject(): Promise<void> {
  const answers: IAnswers = await inquirer
    .prompt(questions)
    .catch((error) => console.error(error));

  // eslint-disable-next-line no-new
  new ProjectGenerator(
    answers.projectName.trim(),
    answers.pkgManager,
    answers.typeScript,
    answers.extraSettings
  );
}

buildProject();
