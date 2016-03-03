'use strict';

const dependable = require('dependable');
const path = require('path');

const config = require('./config.js');
const env = process.env.NODE_ENV || 'development';

const MODULES_PATH = '/modules';
const MODULE_MAIN_FILE = '/app.js';
const MODULE_CONFIG_DIR = '/config';
const HOME_DIR = path.resolve(__dirname, '../');

/**
 * Class for bootstrapping and injecting dependencies inside of application modules
 */
class HoustonModule {
  /**
   * Constructor for module with provided name
   *
   * @param moduleName - module name
   */
  constructor(moduleName) {
    this.modulePath = `${MODULES_PATH}/${moduleName}${MODULE_MAIN_FILE}`;

    this.createContainer();

    this.registerModuleConfigs(moduleName);
  }

  /**
   * Creates deps container
   */
  createContainer() {
    this.container = dependable.container();
  }

  /**
   * Adds provided library to module's deps container
   *
   * @param name - preferred name for lib inside of container
   * @param libPath - path to lib
   * @param options - options for lib
   */
  registerLibrary(name, libPath, options) {
    this.container.registerLibrary(name, require(libPath)(options));
  }

  /**
   * Adds to container module
   *
   * @param modulePath - path to module
   * @param options - options for module
   */
  loadModule(modulePath, options) {
    this.container.load(`${HOME_DIR}${modulePath}`, options);
  }

  /**
   * Registers module's configs to dependencies container
   *
   * @param moduleName - module name
   */
  registerModuleConfigs(moduleName) {
    try {
      const moduleConfigsBundle = config();
      const moduleConfigsPath = `${HOME_DIR}${MODULES_PATH}/${moduleName}${MODULE_CONFIG_DIR}`;

      // adds local module configs to config bundle and merges default configs with env configs
      moduleConfigsBundle.add(`${moduleName}${env.charAt(0).toUpperCase() + env.slice(1)}`, {
        type: 'file',
        file: `${moduleConfigsPath}/${env}.json`
      });

      moduleConfigsBundle.add(`${moduleName}`, {
        type: 'file',
        file: `${moduleConfigsPath}/main.json`
      });

      moduleConfigsBundle.load();

      // passing it to container as config dep
      this.container.register('config', moduleConfigsBundle);
    } catch (error) {
      console.error(`${error.name}: Missing or broken configs (${error.message})`);
    }
  }

  /**
   * Passes the module to container and runs it
   */
  init() {
    const module = require(`${HOME_DIR}${this.modulePath}`);
    this.container.resolve(module);
  }
}

module.exports = {
  getModule(moduleName) {
    return new HoustonModule(moduleName);
  }
};
