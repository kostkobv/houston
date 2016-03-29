'use strict';

/**
 * Restify routes for webhooks
 *
 * @param rollbarController
 * @returns {{registerRoutes: (function(*))}}
 */
module.exports = function(rollbarController, config) {
  return {
    /**
     * Registers routes for all webhook services
     *
     * @param server - server instance
     */
    registerRoutes(server) {
      server.post(config.get('routes:rollbar:webhook'), rollbarController);
    }
  };
};
