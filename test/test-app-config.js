'use strict';

const chai = require('chai');
const expect = chai.expect;
const path = require('path');

const config = require('../app/config');
const nconf = require('nconf');

const PROJECT_DIR = path.resolve(__dirname, '../');

describe('Module Configs', () => {
  before(() => {
    this.configInstance = config();
  });

  after(() => {
    delete this.configInstance;
  });

  it('should create and return the nconf config bundle', () => {
    expect(this.configInstance.constructor.name).to.equal(nconf.constructor.name);
  });

  describe('Config Bundle', () => {
    it('should import the main global config file', () => {
      const globalMainFilePath = this.configInstance.stores.defaults.file;

      expect(globalMainFilePath).be.equal(`${PROJECT_DIR}/config/main.json`);
    });

    it('should merge main global config file with the environment global config file', () => {
      const globalMainFilePath = this.configInstance.stores.default.file;

      expect(globalMainFilePath).be.equal(`${PROJECT_DIR}/config/test.json`);
      expect(this.configInstance.get('pubsub:channels:parser:name')).be.equal('parser1');
    });
  });
});
