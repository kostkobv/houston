'use strict';

const commander = require('commander');
const Module = require('./app/dependencies.js');

commander
  .version('1.0.0', null)
  .description('World Control Center named Houston by MobileBridge');

commander
  .command('module [module-name]')
  .description('run module')
  .action((moduleName) => {
    const module = new Module(moduleName);
    module.instance.init();
  });

commander.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2)) {
  commander.outputHelp();
}
