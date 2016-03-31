'use strict';

/**
 * Restify routes for webhooks
 *
 * @param controller
 * @param config
 * @returns {{registerRoutes: (function(*))}}
 */
module.exports = function(controller, config) {
  function _registerWebhooks(server) {
    const webhooks = config.get('data-sources');

    // iterate through data sources
    for (const name of Object.keys(webhooks)) {
      // make sure there won't be exception here
      const endpoint = config.get(`data-sources:${name}:endpoint`);

      if (endpoint) {
        // register the endpoint from configs
        server.post(endpoint, (req, res, next) => controller(req, res, next, name));
      }
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
