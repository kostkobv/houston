'use strict';

/**
 * Restify routes for webhooks
 *
 * @param rollbarController
 * @param config
 * @returns {{registerRoutes: (function(*))}}
 */
module.exports = function(controller, config) {
  function _registerWebhooks(server) {
    const webhooks = config.get('routes:webhooks');

    for (const webhookKey of Object.keys(webhooks)) {
      server.post(webhooks[webhookKey], (req, res, next) => controller(req, res, next, webhookKey));
    }
  }

  return {
    /**
     * Registers routes for all webhook services
     *
     * @param server - server instance
     */
    registerRoutes(server) {
      _registerWebhooks(server);
    }
  };
};
