const fs = require('fs');

function handleProjectSettings(name, manager, ts, settings) {
  fs.mkdirSync(name);
  console.log(`Your using: ${manager}`);
  console.log(`TS: ${ts}`);
  console.log(`Additional tools: ${settings}`);
}

module.exports = {
  handleProjectSettings,
};
