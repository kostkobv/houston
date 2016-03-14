'use strict';

module.exports = function(log) {
  return function(req, res, next) {
    log.info(`Triggered Rollbar Webhook (${req.body.event_name})`);
    res.send(200);
    next();
  };
};
