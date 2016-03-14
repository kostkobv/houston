/**
 * Created by bv on 01/03/16.
 */

module.exports = function(config, log, restify, routes) {
  const server = restify.createServer();
  server.use(restify.bodyParser());

  routes.registerRoutes(server);

  server.listen(config.get('PORT'), () => {
    log.info(`Rollbar server (${server.name}) is up and listening at ${server.url}`);
  });
};
