'use strict';

module.exports = function(log) {
  return function(req, res, next) {
    log.info(`Got webhook with data ${req.body}`);
    res.send({
      status: 'ok'
    });

    next();
  };
};
