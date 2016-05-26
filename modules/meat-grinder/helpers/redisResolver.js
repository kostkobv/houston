'use strict';

module.exports = function redisResolver(log, redis) {
  return (parsedData, channel) => {
    log.info(`Passing data from ${channel} for save to redis`);

    redis.sadd(channel, JSON.stringify(parsedData));
    log.info('Saved data to redis');
  };
};
