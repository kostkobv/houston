'use strict';

/**
 * Controller that manages the triggered webhook and passing it to meat-grinder
 *
 * @param log
 * @param meatGrinderCommunicator
 * @returns {Function} - controller itself
 */
module.exports = function(log, meatGrinderCommunicator) {
  /**
   * Passes the request body to meat-grinder
   *
   * @param body - request body
   */
  function proceedRequest(body){
    log.info(`Triggered Rollbar Webhook (${body.event_name})`);

    // pass the data to grinder through pubsub
    meatGrinderCommunicator.grind('rollbar', body);
  }

  return function(req, res, next) {
    if (req.body) {
      proceedRequest(req.body);
    }

    // no content here
    res.send(204);
    next();
  };
};
