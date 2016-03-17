/**
 * Created by bv on 01/03/16.
 */

module.exports = function(config, log, restify, routes) {
  const server = restify.createServer();
  server.use(restify.bodyParser());

  routes.registerRoutes(server);

  server.listen(config.get('PORT'), () => {
    log.info(`Captain hook (based on ${server.name}) is on deck and listening at ${server.url}, argghhh`);
  });
};
