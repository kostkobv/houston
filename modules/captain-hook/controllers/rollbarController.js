'use strict';

/**
 * Controller that manages the triggered webhook and passing it to meat-grinder
 *
 * @param log
 * @param meatGrinderCommunicator
 * @returns {Function} - controller itself
 */
module.exports = function(log, meatGrinderCommunicator) {
  return function(req, res, next) {
    log.info(`Triggered Rollbar Webhook (${req.body.event_name})`);
    // no content here
    res.send(204);
    next();

    // pass the data to grinder through pubsub
    meatGrinderCommunicator.grind('rollbar', req.body);
  };
};
