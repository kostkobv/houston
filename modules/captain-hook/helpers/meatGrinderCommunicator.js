'use strict';

module.exports = function(log, config, faye) {
  const client = new faye.Client(config.get('pubsub:fullAddress'));

  return {
    grindData(messageFrom, body) {
      client.publish(`/${messageFrom}`, body);
    }
  }
};