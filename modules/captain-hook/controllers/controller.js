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
   * @param source - channel name
   */
  function proceedRequest(body, source){
    log.info(`Triggered ${source} Webhook`);

    // pass the data to grinder through pubsub
    meatGrinderCommunicator.grind(source, body);
  }

  return function(req, res, next, key) {
    if (req.body) {
      proceedRequest(req.body, key);
    }

    // no content here
    res.send(204);
    next();
  };
};
