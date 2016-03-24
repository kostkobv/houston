'use strict';

/**
 * Seneca module where all parsers are connected to seneca transport
 *
 * @param rollbarParser
 * @param seneca
 */
module.exports = function parser(rollbarParser, seneca, log) {
  log.info('Parser inited');

  seneca.add('parser:rollbar', rollbarParser);
};
