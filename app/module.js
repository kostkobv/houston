'use strict';

const dependable = require('dependable');
const path = require('path');

const config = require('./config.js');
const env = process.env.NODE_ENV || 'development';

const HOME_DIR = path.resolve(__dirname, '../');
const MODULES_PATH = '/modules';

const MODULE_CONFIG_DIR = '/config';
const MODULE_MAIN_FILE = '/app.js';
const MODULE_LIBS_FILE = '/libs.json';

const MODULE_LIBRARIES_LIST = 'libs';
const MODULE_FILES_LIST = 'module';

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
    this.modulePath = `${HOME_DIR}${MODULES_PATH}/${moduleName}`;
    this.moduleConfigsPath = `${HOME_DIR}${MODULES_PATH}/${moduleName}${MODULE_CONFIG_DIR}`;
    this.libList = require(`${this.moduleConfigsPath}${MODULE_LIBS_FILE}`);

    this.createDependableContainer();
    this.createConfigBundle();

    this.registerModuleConfigs(moduleName);
    this.registerModuleLibraries();
    this.registerModuleFiles();
  }

  /**
   * Creates config bundle based on nconf and with global config already inside of it
   */
  createConfigBundle() {
    this.moduleConfigsBundle = config();
  }

  /**
   * Registers files for module basing on file passed
   * into MODULE_LIBS_FILE(module object) and passes it to dependencies container
   */
  registerModuleFiles() {
    try {
      for (const moduleFolder of this.libList[MODULE_FILES_LIST]) {
        this.container.load(`${this.modulePath}/${moduleFolder}`);
      }
    } catch (error) {
      console.error(`${error.name}: Can't register module's files (${error.message})`);
    }
  }

  /**
   * Registers libraries for module basing on file passed
   * into MODULE_LIBS_FILE(libs object) and passes it to dependencies container
   */
  registerModuleLibraries() {
    try {
      for (const lib of this.libList[MODULE_LIBRARIES_LIST]) {
        this.registerLibrary(lib.name, lib.path || lib.name, lib.options);
      }
    } catch (error) {
      console.log(`${error.name}: can't register libraries (${error.message})`);
    }
  }

  /**
   * Creates dependency container
   */
  createDependableContainer() {
    this.container = dependable.container();
  }

  /**
   * Adds provided library to module's dependencies container
   *
   * @param name - preferred name for lib inside of container
   * @param libPath - path to lib
   * @param options - options for lib
   */
  registerLibrary(name, libPath, options) {
    let lib = require(libPath);

    if (options) {
      const parsedOption = this.parseOptions(options);
      lib = lib(parsedOption);
    }

    this.container.register(name, lib);
  }

  /**
   * Parses options for lib and returns it with fulfilled info from global configs.
   *
   * @param options - options that should be parsed
   * @returns {*} - parsed options
   */
  parseOptions(options) {
    // TODO: use here destructuring after migration to Node 6
    for (const option of this.optionsIterator(options)) {
      const key = option[0];
      const value = option[1];

      options[key] = this.getFromGlobalConfig(value);
    }

    return options;
  }

  /**
   * Matches the string with the ${nconf:key} template and fulfills it with data from global configs.
   * Does nothing for string with undefined keys
   *
   * @param value - string in which data should be pasted
   * @returns {string|*} - string with replaced data
   */
  getFromGlobalConfig(value) {
    return value.replace(/\$\{(.*?)\}/mg, (match, key) => this.moduleConfigsBundle.get(key) || match);
  }

  /**
   * Custom iterator for iterating through options object params
   *
   * @param options - options object for which iterator should be created
   */
  *optionsIterator(options) {
    for (const key of Object.keys(options)) {
      yield [key, options[key]];
    }
  }

  /**
   * Adds provided file to configs bundle
   *
   * @param name - name on which file would be accessable
   * @param file - absolute path to file
   */
  addConfigsFileToBundle(name, file) {
    this.moduleConfigsBundle.add(name, {
      type: 'file',
      file
    });
  }

  /**
   * Registers module's configs to dependencies container
   *
   * @param moduleName - module name
   */
  registerModuleConfigs(moduleName) {
    try {
      // adds local module configs to config bundle and merges default configs with env configs
      this.addConfigsFileToBundle(
        `${moduleName}${env.charAt(0).toUpperCase() + env.slice(1)}`,
        `${this.moduleConfigsPath}/${env}.json`);

      this.addConfigsFileToBundle(`${moduleName}`, `${this.moduleConfigsPath}/main.json`);

      this.moduleConfigsBundle.load();

      console.log(this.moduleConfigsBundle);

      // passing it to container as config dep
      this.container.register('config', this.moduleConfigsBundle);
    } catch (error) {
      console.error(`${error.name}: Missing or broken configs (${error.message})`);
    }
  }

  /**
   * Passes the module to container and runs it
   */
  init() {
    const module = require(`${this.modulePath}${MODULE_MAIN_FILE}`);
    this.container.resolve(module);
  }
}

module.exports = {
  getModule(moduleName) {
    return new HoustonModule(moduleName);
  }
};
