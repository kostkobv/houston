'use strict';

const dependable = require('dependable');
const path = require('path');
const log = require('winston');

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
 * Class for retrieving and injecting dependencies inside of application modules
 */
class HoustonModule {
  /**
   * Constructor for module with provided name
   *
   * @param moduleName - module name
   * @param modulePath - path where module is located. Default value is ${HOME_DIR}${MODULES_PATH}/${moduleName}
   */
  constructor(moduleName, modulePath = `${HOME_DIR}${MODULES_PATH}/${moduleName}`) {
    this._modulePath = modulePath;
    this._moduleConfigsPath = `${this._modulePath}${MODULE_CONFIG_DIR}`;

    try {
      this._libList = require(`${this._moduleConfigsPath}${MODULE_LIBS_FILE}`);
    } catch (error) {
      log.info(error.name, `Module does not have dependency file (${error.message})`);
    }

    this._createDependableContainer();
    this._createConfigBundle();

    this._registerModuleConfigs(moduleName);
    this._registerModuleLibraries();
    this._registerModuleFiles();
  }

  /**
   * Creates config bundle based on nconf and with global config already inside of it
   */
  _createConfigBundle() {
    this._moduleConfigsBundle = config();
  }

  /**
   * Registers files for module basing on file passed
   * into MODULE_LIBS_FILE(module object) and passes it to dependencies container
   */
  _registerModuleFiles() {
    if (!this._libList[MODULE_FILES_LIST]) {
      log.info('Module additional files not registered.');
      return;
    }

    for (const moduleFolder of this._libList[MODULE_FILES_LIST]) {
      try {
        this._container.load(`${this._modulePath}/${moduleFolder}`);
      } catch (error) {
        log.error(error.name, `Can't register module's files (${error.message})`);
      }
    }
  }

  /**
   * Registers libraries for module basing on file passed
   * into MODULE_LIBS_FILE(libs object) and passes it to dependencies container
   */
  _registerModuleLibraries() {
    try {
      for (const lib of this._libList[MODULE_LIBRARIES_LIST]) {
        if (typeof lib === 'string') {
          this._registerLibrary(lib, lib);
        } else {
          this._registerLibrary(lib.name, lib.path || lib.name, lib.options);
        }
      }
    } catch (error) {
      log.error(error.name, `Can't register libraries (${error.message})`);
    }
  }

  /**
   * Creates dependency container
   */
  _createDependableContainer() {
    this._container = dependable.container();
  }

  /**
   * Adds provided library to module's dependencies container
   *
   * @param name - preferred name for lib inside of container
   * @param libPath - path to lib
   * @param options - options for lib
   */
  _registerLibrary(name, libPath, options) {
    if (!name) {
      throw new Error('Some of the libraries don\'t have the name.');
    }

    let lib = require(libPath);

    if (options) {
      const parsedOption = this._parseOptions(options);
      lib = lib(parsedOption);
    }

    this._container.register(name, lib);
  }

  /**
   * Parses options for lib and returns it with fulfilled info from global configs.
   *
   * @param options - options that should be parsed
   * @returns {*} - parsed options
   */
  _parseOptions(options) {
    for (const option of this._optionsIterator(options)) {
      const [key, value] = option;

      options[key] = this._getFromGlobalConfig(value);
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
  _getFromGlobalConfig(value) {
    return value.replace(/\$\{(.*?)\}/mg, (match, key) => {
      const retrievedValue = this._moduleConfigsBundle.get(key);
      return typeof retrievedValue !== 'undefined' ? retrievedValue : match;
    });
  }

  /**
   * Custom iterator for iterating through options object params
   *
   * @param options - options object for which iterator should be created
   */
  *_optionsIterator(options) {
    for (const key of Object.keys(options)) {
      yield [key, options[key]];
    }
  }

  /**
   * Adds provided file to module's configs bundle
   *
   * @param name - name on which file would be accessible
   * @param file - absolute path to file
   */
  _addConfigsFileToBundle(name, file) {
    this._moduleConfigsBundle.add(name, {
      type: 'file',
      file
    });
  }

  /**
   * Registers module's configs to dependencies container
   *
   * @param moduleName - module name
   */
  _registerModuleConfigs(moduleName) {
    try {
      // adds local module configs to config bundle and merges default configs with env configs
      this._addConfigsFileToBundle(
        `${moduleName}${env.charAt(0).toUpperCase() + env.slice(1)}`,
        `${this._moduleConfigsPath}/${env}.json`);
    } catch (error) {
      log.error(error.name, `Missing or broken env configuration file (${error.message})`);
    }

    try {
      this._addConfigsFileToBundle(`${moduleName}`, `${this._moduleConfigsPath}/main.json`);
    } catch (error) {
      log.error(error.name, `Missing or broken main module configuration file (${error.message})`);
    }

    this._moduleConfigsBundle.load();

    // passing it to container as config dep
    this._container.register('config', this._moduleConfigsBundle);
  }

  /**
   * Passes the module's main file to container and runs it
   */
  init() {
    const module = require(`${this._modulePath}${MODULE_MAIN_FILE}`);
    this._container.resolve(module);
  }
}

module.exports = {
  getModule(moduleName, modulePath) {
    if (!moduleName || typeof moduleName !== 'string') {
      throw new Error('module-name is invalid');
    }

    return new HoustonModule(moduleName, modulePath);
  }
};
