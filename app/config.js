'use strict';

const config = require('nconf');
const path = require('path');
const env = process.env.NODE_ENV || 'development';

const GLOBAL_CONFIG_DIR_PATH = '/config';
const HOME_DIR = path.resolve(__dirname, '../');

/**
 * Creates a config instance with globalConfigs within
 *
 * @returns {Provider|*|exports|module.exports} - nconf instance
 */
function getConfigs() {

  const MAIN_CONFIG_PATH = `${HOME_DIR}${GLOBAL_CONFIG_DIR_PATH}/main.json`;
  const ENV_CONFIG_PATH = `${HOME_DIR}${GLOBAL_CONFIG_DIR_PATH}/${env}.json`;

  config.argv().env();

  config.add('default', {
    type: 'file',
    file: ENV_CONFIG_PATH
  });

  config.add('defaults', {
    type: 'file',
    file: MAIN_CONFIG_PATH
  });

  return config;
}

module.exports = getConfigs;
