'use strict';

const chai = require('chai');
const expect = chai.expect;
const path = require('path');

const appModule = require('../app/module.js');

const TEST_MODULE_DIR = path.resolve(__dirname, './mocks/modules/test');

describe('Module', () => {
  before(() => {
    this.testModule = appModule.getModule('test', TEST_MODULE_DIR);
  });

  after(() => {
    delete this.testModule;
  });

  it('should return the new HoustonModule instance', () => {
    expect(this.testModule.constructor.name).to.equal('HoustonModule');
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
    const initTestModule = () => {
      this.testModule.init();
    };

    expect(initTestModule).to.throw(Error, 'It works!');
  });

  it('should have container for dependencies within', () => {
    expect(this.testModule._container).to.respondTo('register');
    return expect(this.testModule._container).to.not.be.undefined;
  });

  describe('Module container', () => {
    it('should contain config bundle with module configs within', () => {
      const stores = this.testModule._moduleConfigsBundle.stores;
      const globalMainFilePath = stores.test.file;
      const envModuleConfigFilePath = stores.testTest.file;

      expect(globalMainFilePath).to.be.equal(`${TEST_MODULE_DIR}/config/main.json`);
      expect(envModuleConfigFilePath).to.be.equal(`${TEST_MODULE_DIR}/config/test.json`);
    });

    it('should merge the env configs over the main configs', () => {
      return expect(this.testModule._moduleConfigsBundle.get('test')).to.be.true;
    });

    it('should have all libs of module injected', () => {
      return expect(this.testModule._container.get('ioredis')).not.to.be.undefined;
    });

    it('should import lib from libs.json if its passed as string', () => {
      return expect(this.testModule._container.get('http')).not.to.be.undefined;
    });

    it('should have all parts of module injected', () => {
      return expect(this.testModule._container.get('testService')).not.to.be.undefined;
    });

    it('should replace keys from global config basing on ${key:subkey:...} template', () => {
      const retrievedValue = this.testModule._moduleConfigsBundle.get('redis');

      const parsedOptions = this.testModule._parseOptions({
        example: '${redis}'
      });

      expect(parsedOptions.example).to.be.equal(`${retrievedValue}`);
    });
  });
});
