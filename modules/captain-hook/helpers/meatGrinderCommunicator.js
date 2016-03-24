'use strict';

/**
 * Module for passing the data to grinder via pubsub
 *
 * @param log
 * @param config
 * @param seneca
 * @returns {{grind: (function(*=, *=))}}
 */
module.exports = function(log, config, seneca) {
  return {
    /**
     * Function for passing the data to grinder
     *
     * @param source - data source (rollbar, jira, etc)
     * @param data - data itself
     */
    grind(source, data) {
      seneca.act( { 'parser': source, 'data': data },
        (err) => {
          if (err) {
            log.error(err);
          }
        }
      );
    }
  }
};