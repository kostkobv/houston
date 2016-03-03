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
 * Class for bootstraping and injecting dependencies inside of application modules
 */
class HoustonModule {
  /**
   *
   * @param moduleName
   */
  constructor(moduleName) {
    this.modulePath = `${MODULES_PATH}/${moduleName}${MODULE_MAIN_FILE}`;

    this.createContainer();

    this.registerModuleConfigs(moduleName);
  }

  createContainer() {
    this.container = dependable.container();
  }

  /**
   *
   * @param name
   * @param libPath
   * @param options
   */
  registerLibrary(name, libPath, options) {
    this.container.registerLibrary(name, require(libPath)(options));
  }

  /**
   * @param modulePath
   * @param options
   */
  loadModule(modulePath, options) {
    this.container.load(`${HOME_DIR}${modulePath}`, options);
  }

  /**
   * Registering module configs
   */
  registerModuleConfigs(moduleName) {
    try {
      // path for module configs
      const moduleConfigs = config();

      moduleConfigs.add(`${moduleName}`, {
        type: 'file',
        file: `${HOME_DIR}${moduleName}/main.json`
      });

      // adds
      moduleConfigs.add(`${moduleName}${env.charAt(0).toUpperCase() + env.slice(1)}`, {
        type: 'file',
        file: `${HOME_DIR}${moduleName}/${env}.json`
      });

      moduleConfigs.load();

      // passing it to container
      this.container.register('config', moduleConfigs);
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
