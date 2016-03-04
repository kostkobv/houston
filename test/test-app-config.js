'use strict';

const chai = require('chai');
const expect = chai.expect;
const path = require('path');

const config = require('../app/config');
const nconf = require('nconf');

const PROJECT_DIR = path.resolve(__dirname, '../');

describe('Module Configs', () => {
  it('should create and return the nconf config bundle', () => {
    const configInstance = config();
    expect(configInstance.constructor.name).to.equal(nconf.constructor.name);
  });

  describe('Config Bundle', () => {
    it('should import the main global config file', () => {
      const configInstance = config();
      const globalMainFilePath = configInstance.stores.defaults.file;

      expect(globalMainFilePath).be.equal(`${PROJECT_DIR}/config/main.json`);
    });

    it('should merge main global config file with the environment global config file', () => {
      const configInstance = config();
      const globalMainFilePath = configInstance.stores.default.file;

      expect(globalMainFilePath).be.equal(`${PROJECT_DIR}/config/test.json`);
      return expect(configInstance.get('redis')).be.null;
    });
  });
});
