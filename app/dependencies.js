'use strict';

const dependable = require('dependable');
const path = require('path');

const MODULES_FOLDER = './modules/';
const MODULE_MAIN_FILE = '/app.js';
const MODULE_CONFIG_DIR = '/config';

const globalConfig = require('./config');

/**
 * Class for bootstraping and injecting dependencies inside of application modules
 */
class Module {
  constructor(moduleName) {
    this.container = dependable.container();

    this.homeDir = path.resolve(__dirname, '../');
    this.modulePath = `${MODULES_FOLDER}${moduleName}${MODULE_MAIN_FILE}`;
    this.config = require(`${MODULES_FOLDER}${moduleName}${MODULE_CONFIG_DIR}`);

    this.container.register('config', config);
    this.container.register('globalConfig', globalConfig);


  },

  /**
   *
   * @param name
   * @param path
   * @param options
   */
  registerLibrary(name, path, options) {
    this.container.registerLibrary(name, require(path)(options));
  },

  /**
   *
   * @param path
   * @param options
   */
  loadModule(path, options) {
    this.container.load(`${this.homeDir}${path}`, options);
  },

  /**
   *
   * @returns {*}
   */
  get instance() {
    let module = require(`${this.homeDir}${this.modulePath}`);

    module = this.container.resolve(module);
    module.container = this.container;

    return module;
  }
}

module.exports = Module;
