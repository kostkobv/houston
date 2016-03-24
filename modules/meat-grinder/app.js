'use strict';

/**
 * Meat-grinder is a module which parses and transforming all the incoming data to consistent form
 *
 * @param log
 * @param parser
 * @param seneca
 */
module.exports = function(log, parser, seneca) {
  log.info('Meat-grinder is up and ready to grind');

  // seneca here is used as microservice framework with redis as pubsub server
  seneca
    .use('redis-transport')
    .listen({
      type: 'redis',
      pin: 'parser:*'
    });
};
