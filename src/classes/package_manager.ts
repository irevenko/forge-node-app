/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import ora from 'ora';
import { execSync } from 'child_process';
import { IPackage } from '../interfaces';
import {
  babelDependencies,
  babelLinterDependencies,
  eslintDependencies,
  eslintTsDependencies,
  lintFormatDependencies,
  tsDependencies,
  lintAirBnbDependencies,
  lintGoogleDependencies,
  lintStandardDependencies,
} from '../config/dependencies';
import {
  eslintIgnore,
  prettierIgnore,
  dotenvCommonFile,
  dotenvFile,
  dotenvESFile,
  prettierConfig,
  babelConfig,
} from '../config/misc';
import esLint from '../config/eslint/index.eslint';

class PackageManager {
  static initPackage(
    projectName: string,
    pkgManager: string,
    pkgQuestions: string
  ): void {
    const packageSpinner = ora(
      `🔨 Initializing The Package with ${pkgManager}...`
    ).start();

    fs.mkdirSync(projectName);
    if (pkgQuestions === 'Go with defaults') {
      execSync(`cd ${projectName} && ${pkgManager} init -y`, {
        stdio: 'ignore',
      });
    } else {
      execSync(`cd ${projectName} && ${pkgManager} init`, { stdio: 'inherit' });
    }

    packageSpinner.succeed(`🔨 Initialized The Package with ${pkgManager}`);
  }

  static createScripts(
    projectName: string,
    typeScript: boolean,
    babel: boolean,
    extraLibs?: Array<string>,
    tests?: string
  ): void {
    const scriptsSpinner = ora('📜 Creating Scripts...').start();

    const pkgJSON: IPackage = JSON.parse(
      fs.readFileSync(`${projectName}/package.json`, 'utf8')
    );

    pkgJSON.scripts = {};

    if (typeScript) {
      pkgJSON.scripts.start = 'npx ts-node src/index.ts';
    } else if (babel) {
      pkgJSON.scripts.start = 'npx babel-node src/index.js';
    } else {
      pkgJSON.scripts.start = 'node src/index.js';
    }

    typeScript ? (pkgJSON.main = 'index.ts') : (pkgJSON.main = 'index.js');

    if (typeScript) {
      pkgJSON.scripts['start:source'] = 'npx tsc && node out/index.ts';
      pkgJSON.scripts.build = 'npx tsc';
      pkgJSON.scripts.watch = 'npx tsc src/index.ts --watch';
    }

    if (babel) {
      pkgJSON.scripts['start:source'] = 'npm run build && node out/index.js';
      pkgJSON.scripts.build =
        'npx babel src -d out --presets @babel/preset-env';
      pkgJSON.scripts.watch =
        'npx babel src -d out --presets @babel/preset-env -w';
    }

    if (tests === 'Jest') {
      pkgJSON.scripts.test = 'npx jest';
    }

    if (tests === 'Mocha + Chai') {
      if (typeScript) {
        pkgJSON.scripts.test =
          'npx mocha __tests__/**/*.ts -r ts-node/register';
      } else if (babel) {
        pkgJSON.scripts.test =
          'npx mocha __tests__/**/*.js --require @babel/register --require @babel/polyfill';
      } else {
        pkgJSON.scripts.test = 'npx mocha __tests__/**/*.js';
      }
    }

    if (extraLibs!.includes('ESLint')) {
      typeScript
        ? (pkgJSON.scripts.lint = 'npx eslint src/*.ts')
        : (pkgJSON.scripts.lint = 'npx eslint src/*.js');
      typeScript
        ? (pkgJSON.scripts['lint:fix'] = 'npx eslint src/*.ts --fix')
        : (pkgJSON.scripts['lint:fix'] = 'npx eslint src/*.js --fix');
    }

    if (extraLibs!.includes('Prettier')) {
      typeScript
        ? (pkgJSON.scripts.format = 'npx prettier src/*.ts --write')
        : (pkgJSON.scripts.format = 'npx prettier src/*.js --write');
    }

    if (extraLibs!.includes('nodemon or ts-node-dev')) {
      if (typeScript) {
        pkgJSON.scripts.dev = 'npx ts-node-dev --respawn src/index';
      } else if (babel) {
        pkgJSON.scripts.dev = 'npx nodemon --exec babel-node src/index';
      } else {
        pkgJSON.scripts.dev = 'npx nodemon src/index';
      }
    }

    fs.writeFileSync(
      `${projectName}/package.json`,
      JSON.stringify(pkgJSON, null, 2)
    );

    scriptsSpinner.succeed('📜 Created Scripts');
  }

  static addPackageDetails(
    projectName: string,
    licenseType?: string,
    licenseAuthor?: string,
    git?: boolean,
    hostingPLatform?: string,
    platformUsername?: string,
    repositoryName?: string
  ): void {
    const detailsSpinner = ora('📋 Adding Package Details...').start();

    const pkgJSON: IPackage = JSON.parse(
      fs.readFileSync(`${projectName}/package.json`, 'utf8')
    );

    pkgJSON.description = 'YOUR DESCRIPTION';
    pkgJSON.license = licenseType || 'YOUR LICENSE';
    pkgJSON.author = licenseAuthor || 'YOUR NAME <YOUR EMAIL>';
    pkgJSON.keywords = ['key', 'words'];

    if (git) {
      pkgJSON.repository = {
        type: 'git',
        url: `https://${hostingPLatform!.toLowerCase()}.com/${platformUsername}/${repositoryName}`,
      };
      pkgJSON.bugs = {
        url: `https://${hostingPLatform!.toLowerCase()}.com/${platformUsername}/${repositoryName}/issues`,
      };
    }

    fs.writeFileSync(
      `${projectName}/package.json`,
      JSON.stringify(pkgJSON, null, 2)
    );

    detailsSpinner.succeed('📋 Added Package Details');
  }

  static installTsDependencies(pkgManager: string, projectName: string): void {
    const tsSpinner = ora('📥 Setting Up TypeScript...').start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i ${tsDependencies}`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add ${tsDependencies}`, {
        stdio: 'ignore',
      });
    }

    tsSpinner.succeed('📥 Set Up TypeScript');
  }

  static addBabel(projectName: string, pkgManager: string): void {
    const babelSpinner = ora('🐠 Adding Babel...').start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i ${babelDependencies} -D`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add ${babelDependencies} -D`, {
        stdio: 'ignore',
      });
    }

    fs.writeFileSync(`${projectName}/.babelrc`, babelConfig);

    babelSpinner.succeed('🐠 Added Babel');
  }

  static addEslint(
    projectName: string,
    pkgManager: string,
    eslintConfig: string,
    typeScript: boolean,
    babel: boolean,
    prettier: boolean
  ): void {
    const linterSpinner = ora('🔎 Adding ESLint...').start();

    fs.writeFileSync(`${projectName}/.eslintignore`, eslintIgnore);

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i ${eslintDependencies} -D`, {
        stdio: 'ignore',
      });
      if (typeScript) {
        execSync(`cd ${projectName} && npm i ${eslintTsDependencies} -D`, {
          stdio: 'ignore',
        });
      }
    }

    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add ${eslintDependencies} -D`, {
        stdio: 'ignore',
      });
      if (typeScript) {
        execSync(`cd ${projectName} && yarn add ${eslintTsDependencies} -D`, {
          stdio: 'ignore',
        });
      }
    }
    // eslint-disable-next-line default-case
    switch (eslintConfig) {
      case 'Only Errors':
        if (typeScript && prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.tsPretty, null, 2)
          );
        } else if (typeScript) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.ts, null, 2)
          );
        } else if (babel && prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.babelPretty, null, 2)
          );
        } else if (babel) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.babel, null, 2)
          );
        } else if (prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.jsPretty, null, 2)
          );
        } else {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.js, null, 2)
          );
        }
        break;
      case 'AirBNB':
        if (typeScript && prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.airBnb.tsPretty, null, 2)
          );
        } else if (typeScript) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.airBnb.ts, null, 2)
          );
        } else if (babel && prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.airBnb.babelPretty, null, 2)
          );
        } else if (babel) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.airBnb.babel, null, 2)
          );
        } else if (prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.airBnb.jsPretty, null, 2)
          );
        } else {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.airBnb.js, null, 2)
          );
        }
        if (pkgManager === 'npm') {
          execSync(`cd ${projectName} && npm i ${lintAirBnbDependencies} -D`, {
            stdio: 'ignore',
          });
        }
        if (pkgManager === 'yarn') {
          execSync(
            `cd ${projectName} && yarn add ${lintAirBnbDependencies} -D`,
            {
              stdio: 'ignore',
            }
          );
        }
        break;
      case 'Google':
        if (typeScript && prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.google.tsPretty, null, 2)
          );
        } else if (typeScript) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.google.ts, null, 2)
          );
        } else if (babel && prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.google.babelPretty, null, 2)
          );
        } else if (babel) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.google.babel, null, 2)
          );
        } else if (prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.google.jsPretty, null, 2)
          );
        } else {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.google.js, null, 2)
          );
        }
        if (pkgManager === 'npm') {
          execSync(`cd ${projectName} && npm i ${lintGoogleDependencies} -D`, {
            stdio: 'ignore',
          });
        }
        if (pkgManager === 'yarn') {
          execSync(
            `cd ${projectName} && yarn add ${lintGoogleDependencies} -D`,
            {
              stdio: 'ignore',
            }
          );
        }
        break;
      case 'Standard':
        if (typeScript && prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.standard.tsPretty, null, 2)
          );
        } else if (typeScript) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.standard.ts, null, 2)
          );
        } else if (babel && prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.standard.babelPretty, null, 2)
          );
        } else if (babel) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.standard.babel, null, 2)
          );
        } else if (prettier) {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.standard.jsPretty, null, 2)
          );
        } else {
          fs.writeFileSync(
            `${projectName}/.eslintrc.json`,
            JSON.stringify(esLint.standard.js, null, 2)
          );
        }
        if (pkgManager === 'npm') {
          execSync(
            `cd ${projectName} && npm i ${lintStandardDependencies} -D`,
            {
              stdio: 'ignore',
            }
          );
        }
        if (pkgManager === 'yarn') {
          execSync(
            `cd ${projectName} && yarn add ${lintStandardDependencies} -D`,
            {
              stdio: 'ignore',
            }
          );
        }
        break;
    }

    linterSpinner.succeed('🔎 Added ESLint');
  }

  static addPrettier(projectName: string, pkgManager: string): void {
    const prettierSpinner = ora('🧹 Adding Prettier...').start();

    fs.writeFileSync(`${projectName}/.prettierignore`, prettierIgnore);
    fs.writeFileSync(`${projectName}/.prettierrc`, prettierConfig);

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i prettier -D`, { stdio: 'ignore' });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add prettier -D`, {
        stdio: 'ignore',
      });
    }

    prettierSpinner.succeed('🧹 Added Prettier');
  }

  static attachLinterWithPrettier(
    projectName: string,
    pkgManager: string
  ): void {
    const linterPrettierSpinner = ora(
      '🖇 Connecting ESLint with Prettier...'
    ).start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i ${lintFormatDependencies} -D`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add ${lintFormatDependencies} -D`, {
        stdio: 'ignore',
      });
    }

    linterPrettierSpinner.succeed('🖇 Connected ESLint with Prettier');
  }

  static attachLinterWithBabel(projectName: string, pkgManager: string): void {
    const linterPrettierSpinner = ora(
      '🖇 Connecting ESLint with Babel...'
    ).start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i ${babelLinterDependencies} -D`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add ${babelLinterDependencies} -D`, {
        stdio: 'ignore',
      });
    }

    linterPrettierSpinner.succeed('🖇 Connected ESLint with Babel');
  }

  static addDotenv(
    projectName: string,
    pkgManager: string,
    typeScript: boolean,
    babel: boolean
  ): void {
    const dotenvSpinner = ora('🔒 Adding Dotenv...').start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i dotenv -D`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add dotenv -D`, {
        stdio: 'ignore',
      });
    }

    fs.writeFileSync(`${projectName}/.env`, dotenvFile);

    if (typeScript) {
      fs.appendFileSync(`${projectName}/src/index.ts`, dotenvESFile);
    } else if (babel) {
      fs.appendFileSync(`${projectName}/src/index.js`, dotenvESFile);
    } else {
      fs.appendFileSync(`${projectName}/src/index.js`, dotenvCommonFile);
    }

    dotenvSpinner.succeed('🔒 Added Dotenv');
  }

  static addChangesMonitor(
    projectName: string,
    pkgManager: string,
    typeScript: boolean
  ): void {
    const nodemonSpinner = ora('🔁 Adding Changes Montitor...').start();

    if (pkgManager === 'npm') {
      typeScript
        ? execSync(`cd ${projectName} && npm i ts-node-dev -D`, {
            stdio: 'ignore',
          })
        : execSync(`cd ${projectName} && npm i nodemon -D`, {
            stdio: 'ignore',
          });
    }

    if (pkgManager === 'yarn') {
      typeScript
        ? execSync(`cd ${projectName} && yarn add ts-node-dev -D`, {
            stdio: 'ignore',
          })
        : execSync(`cd ${projectName} && yarn add nodemon -D`, {
            stdio: 'ignore',
          });
    }

    nodemonSpinner.succeed('🔁 Added Changes Monitor');
  }

  static addJest(
    projectName: string,
    pkgManager: string,
    typeScript: boolean,
    babel: boolean
  ): void {
    const jestSpinner = ora('🃏 Adding Jest...').start();

    if (pkgManager === 'npm') {
      typeScript
        ? execSync(`cd ${projectName} && npm i jest @types/jest ts-jest -D`, {
            stdio: 'ignore',
          })
        : execSync(`cd ${projectName} && npm i jest -D`, {
            stdio: 'ignore',
          });
      if (babel) {
        execSync(`cd ${projectName} && npm i jest-babel -D`, {
          stdio: 'ignore',
        });
      }
    }

    if (pkgManager === 'yarn') {
      typeScript
        ? execSync(
            `cd ${projectName} && yarn add jest @types/jest ts-jest -D`,
            { stdio: 'ignore' }
          )
        : execSync(`cd ${projectName} && yarn add jest -D`, {
            stdio: 'ignore',
          });
      if (babel) {
        execSync(`cd ${projectName} && yarn add jest-babel -D`, {
          stdio: 'ignore',
        });
      }
    }

    if (typeScript) {
      execSync(`cd ${projectName} && npx ts-jest config:init`, {
        stdio: 'ignore',
      });
      fs.renameSync(
        `${projectName}/jest.config.js`,
        `${projectName}/jest.config.ts`
      );
    }

    jestSpinner.succeed('🃏 Added Jest');
  }

  static addMochaChai(
    projectName: string,
    pkgManager: string,
    typeScript: boolean,
    babel: boolean
  ): void {
    const mochaChaiSpinner = ora('🍵 Adding Mocha & Chai...').start();

    if (pkgManager === 'npm') {
      typeScript
        ? execSync(
            `cd ${projectName} && npm i mocha chai @types/mocha @types/chai -D`,
            {
              stdio: 'ignore',
            }
          )
        : execSync(`cd ${projectName} && npm i mocha chai -D`, {
            stdio: 'ignore',
          });
      if (babel) {
        execSync(
          `cd ${projectName} && npm i @babel/register @babel/polyfill -D`,
          {
            stdio: 'ignore',
          }
        );
      }
    }

    if (pkgManager === 'yarn') {
      typeScript
        ? execSync(
            `cd ${projectName} && yarn add mocha chai @types/mocha @types/chai -D`,
            {
              stdio: 'ignore',
            }
          )
        : execSync(`cd ${projectName} && yarn add mocha chai -D`, {
            stdio: 'ignore',
          });
      if (babel) {
        execSync(
          `cd ${projectName} && yarn add @babel/register @babel/polyfill -D`,
          {
            stdio: 'ignore',
          }
        );
      }
    }

    mochaChaiSpinner.succeed('🍵 Added Mocha & Chai');
  }
}

export default PackageManager;
