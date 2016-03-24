'use strict';

/**
 * Restify routes for webhooks
 *
 * @param rollbarController
 * @returns {{registerRoutes: (function(*))}}
 */
module.exports = function(rollbarController) {
  return {
    /**
     * Registers routes for all webhook services
     *
     * @param server - server instance
     */
    registerRoutes(server) {
      server.post('/rollbar/webhook', rollbarController);
    }
  };
};
