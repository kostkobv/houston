'use strict';

module.exports = function(log, faye, http, config) {
  const PORT = config.get('pubsub:port');
  const SERVER_MOUNT = config.get('pubsub:mount');

  // creating server and faye node adapter
  const server = http.createServer();
  const bayeux = new faye.NodeAdapter(
    {
      mount: SERVER_MOUNT,
      timeout: 45
    }
  );

  // running the server and attaching faye to it
  bayeux.attach(server);
  server.listen(PORT);

  log.info(`Pubsub server is up on port ${PORT} and mounted on ${SERVER_MOUNT}`);
};
