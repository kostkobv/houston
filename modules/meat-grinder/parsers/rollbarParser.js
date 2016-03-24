'use strict';

/**
 * Module for parsing data from rollbar
 *
 * @param log - winston
 * @returns {Function} - callback for seneca
 */
module.exports = function rollbarParser(log) {

  /**
   * Transforms the received data from rollbar
   *
   * @param data - raw data from rollbar
   */
  function transformData(data) {
    
  }

  return function(args, done) {
    transformData(args.data);
    log.info('Got Rollbar data from Captain Hook!');

    done();
  };
};
