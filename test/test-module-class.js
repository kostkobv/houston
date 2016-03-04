'use strict';

describe('Module', () => {
  it('should return the new HoustonModule instance with the provided name');
  it('should have container with all dependencies');

  describe('container', () => {
    it('should contain config bundle with module configs within');
    it('should have all libs of module injected');
    it('should have all parts of module injected');
  });

  it('should run the module after init function call');
});
