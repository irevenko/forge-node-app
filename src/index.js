const inquirer = require('inquirer');
const { questions } = require('./questions');

// let finalSetup = [];

inquirer
  .prompt(questions)
  .then((answers) => {
    return answers;
  })
  .catch((error) => {
    console.error(error);
  });
