'use strict';

/**
 * Seneca module where all parsers are connected to seneca transport
 */
module.exports = function parser(seneca, log, config, parseData, redisResolver) {
  const PARSER_CHANNEL_NAME = config.get('pubsub:channels:parser:name');

  log.info('Parser inited');

  // seneca listener for parser events from captain hook
  seneca.add(`role:${PARSER_CHANNEL_NAME}`, (args, done) => {
    const { source, data } = args;

    log.info(`Got ${source} data from Captain Hook!`);

    try {
      log.info(`Passing data from ${source} for parsing`);
      const parsedData = parseData(source, data).parse();
      
      log.info('Data parsed');

      redisResolver(parsedData, source);
      
    } catch(error) {
      log.error(error.name, error.message);
    }

    done(null);
  });
};
