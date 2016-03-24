/**
 * Created by bv on 01/03/16.
 */

/**
 * Captain Hook is a module which has a web server and listens for triggered webhooks.
 * After any webhook's triggered passes the data to meat-grinder via seneca pubsub (parser:* channel).
 *
 * Requires:
 * @param config
 * @param log
 * @param restify
 * @param routes
 * @param seneca
 */
module.exports = function(config, log, restify, routes, seneca) {
  // creates restify server
  const server = restify.createServer();
  server.use(restify.bodyParser());

  // register routes
  routes.registerRoutes(server);

  // start listening webhooks on specified PORT from module configs or from env
  server.listen(config.get('PORT'), () => {
    log.info(`Captain hook (based on ${server.name}) is on deck and listening at ${server.url}, argghhh`);
  });

  // registers to seneca pubsub as publisher for 'parser:*' channel (meat-grinder)
  seneca
    .use('redis-transport')
    .client({
      type: 'redis',
      pin: 'parser:*'
    });
};
