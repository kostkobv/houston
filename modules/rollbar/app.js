/**
 * Created by bv on 01/03/16.
 */

module.exports = function(config) {
  console.log(config.get('rollbar:libs'));
  console.log(config.get('redis'));
};
