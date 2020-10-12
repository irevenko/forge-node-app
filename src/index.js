const inquirer = require('inquirer');
const { questions } = require('./questions');

inquirer
  .prompt(questions)
  .then((answers) => answers)
  .catch((error) => {
    console.error(error);
  });
