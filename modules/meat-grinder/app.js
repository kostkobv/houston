'use strict';

/**
 * Meat-grinder is a module which parses and transforming all the incoming data to consistent form
 *
 * @param log
 * @param parser
 * @param seneca
 */
module.exports = function(log, parser, seneca, config) {
  log.info('Meat-grinder is up and ready to grind');

  const PARSER_CHANNEL_NAME = config.get('pubsub:channels:parser:name');

  // seneca here is used as microservice framework with redis as pubsub server
  seneca
    .use('redis-transport')
    .listen({
      type: 'redis',
      pin: `role:${PARSER_CHANNEL_NAME}`
    });
};
