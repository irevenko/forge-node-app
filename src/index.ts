import inquirer from 'inquirer';
import questions from './helpers/questions';
import handleProjectSettings from './helpers/project_generator';

interface IAnswers {
  projectName: string;
  pkgManager: string;
  typeScript: boolean;
  extraSettings?: Array<string>;
}

async function buildProject(): Promise<void> {
  const answers: IAnswers = await inquirer
    .prompt(questions)
    .catch((error) => console.error(error));

  handleProjectSettings(
    answers.projectName.trim(),
    answers.pkgManager,
    answers.typeScript,
    answers.extraSettings!
  );
}

buildProject();
