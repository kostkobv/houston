'use strict';

const chai = require('chai');
const expect = chai.expect;
const path = require('path');

const appModule = require('../app/module.js');

const TEST_MODULE_DIR = path.resolve(__dirname, './mocks/modules/test');

describe('Module', () => {
  it('should return the new HoustonModule instance', () => {
    const testModule = appModule.getModule('test', TEST_MODULE_DIR);

    expect(testModule.constructor.name).to.equal('HoustonModule');
  });
  it('should throw error if module name is "falsy"', () => {
    const moduleWithEmptyName = () => {
      appModule.getModule();
    };

    const moduleWithNullName = () => {
      appModule.getModule(null);
    };

    const moduleWithFalseName = () => {
      appModule.getModule(false);
    };

    const moduleWithNaNName = () => {
      appModule.getModule(NaN);
    };

    expect(moduleWithEmptyName).to.throw(Error, 'module-name is invalid');
    expect(moduleWithNullName).to.throw(Error, 'module-name is invalid');
    expect(moduleWithFalseName).to.throw(Error, 'module-name is invalid');
    expect(moduleWithNaNName).to.throw(Error, 'module-name is invalid');
  });

  it('should throw error if module name is not a string', () => {
    const moduleWithIntName = () => {
      appModule.getModule(123213);
    };

    const moduleWithBoolName = () => {
      appModule.getModule(true);
    };

    expect(moduleWithIntName).to.throw(Error, 'module-name is invalid');
    expect(moduleWithBoolName).to.throw(Error, 'module-name is invalid');
  });

  it('should run the module after init function call', () => {
    const testModule = appModule.getModule('test', TEST_MODULE_DIR);

    const initTestModule = () => {
      testModule.init();
    };

    expect(initTestModule).to.throw(Error, 'It works!');
  });

  it('should have container for dependencies within', () => {
    const testModule = appModule.getModule('test', TEST_MODULE_DIR);

    expect(testModule._container).to.respondTo('register');
    return expect(testModule._container).to.not.be.undefined;
  });

  describe('Module container', () => {
    it('should contain config bundle with module configs within', () => {
      const testModule = appModule.getModule('test', TEST_MODULE_DIR);

      const globalMainFilePath = testModule._moduleConfigsBundle.stores.test.file;
      const envModuleConfigFilePath = testModule._moduleConfigsBundle.stores.testTest.file;

      expect(globalMainFilePath).to.be.equal(`${TEST_MODULE_DIR}/config/main.json`);
      expect(envModuleConfigFilePath).to.be.equal(`${TEST_MODULE_DIR}/config/test.json`);
    });

    it('should merge the env configs over the main configs', () => {
      const testModule = appModule.getModule('test', TEST_MODULE_DIR);

      return expect(testModule._moduleConfigsBundle.get('test')).to.be.true;
    });

    it('should have all libs of module injected', () => {
      const testModule = appModule.getModule('test', TEST_MODULE_DIR);
      const moduleContainer = testModule._container;

      return expect(moduleContainer.get('ioredis')).not.to.be.undefined;
    });

    it('should have all parts of module injected', () => {
      const testModule = appModule.getModule('test', TEST_MODULE_DIR);
      const moduleContainer = testModule._container;

      return expect(moduleContainer.get('testService')).not.to.be.undefined;
    });

    it('should replace keys from global config basing on ${key:subkey:...} template', () => {
      const testModule = appModule.getModule('test', TEST_MODULE_DIR);
      const retrievedValue = testModule._moduleConfigsBundle.get('redis');

      const parsedOptions = testModule._parseOptions({
        example: '${redis}'
      });

      expect(parsedOptions.example).to.be.equal(`${retrievedValue}`);
    });
  });
});
