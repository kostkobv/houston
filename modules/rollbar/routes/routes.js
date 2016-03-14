'use strict';

module.exports = function(rollbarController) {
  return {
    registerRoutes(server) {
      server.post('/rollbar/webhook', rollbarController);
    }
  };
};
