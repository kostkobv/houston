'use strict';

module.exports = function(log, config) {
  return function(req, res, next) {
    log.info(`Triggered Rollbar Webhook (${req.body.event_name})`);
    res.send(204);
    next();
  };
};
