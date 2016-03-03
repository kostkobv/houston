'use strict';

const commander = require('commander');
const appModule = require('./app/module.js');

commander
  .version('1.0.0', null)
  .description('World Control Center named Houston by MobileBridge');

commander
  .command('module [module-name]')
  .description('run module')
  .action((moduleName) => {
    try {
      if (!moduleName) {
        throw new Error('module-name is not provided');
      }

      appModule.getModule(moduleName).init();
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
    }

  });

commander.parse(process.argv);

// Show help if no command provided
if (process.argv.length < 3) {
  commander.outputHelp();
}
