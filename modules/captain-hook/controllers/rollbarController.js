'use strict';

module.exports = function(log, meatGrinderCommunicator, config) {
  const SERVICE_NAME = config.get('services:rollbar');

  return function(req, res, next) {
    log.info(`Triggered Rollbar Webhook (${req.body.event_name})`);
    res.send(204);
    next();
    
    // send data for grinding
    meatGrinderCommunicator.grindData(SERVICE_NAME, req.body);
  };
};
