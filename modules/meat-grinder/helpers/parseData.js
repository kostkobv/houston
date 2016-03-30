'use strict';

module.exports = function parseData(log, config) {
  /**
   * Parser transforms data using the map schemes from configs
   */
  class Parser {
    /**
     * Creates the parser object
     *
     * @param channel - channel from which data came
     * @param data - the data itself
     * @param _config - the injected nconf object
     */
    constructor(channel, data, _config) {
      this._config = _config;

      this._source = this._getSource(channel);
      this._data = data;

      this._splitSymbol = this._config.get('parsers:split-symbol');
    }

    /**
     * Decrypts the source of the data by channel name.
     *
     * @param channel - channel name
     * @returns {T|undefined|*} - source of data
     * @private
     */
    _getSource(channel) {
      const channelsName = this._config.get('pubsub:channels:parser:sources');
      const source = channelsName ? channelsName[channel] : undefined;

      if (source === undefined) {
        throw new Error('Message from unknown source. Shouldn\'t be here');
      }

      return source;
    }

    /**
     * Triggers the parsing action and returns already parsed data
     * @returns {{}} - parsed data
     */
    parse() {
      let parsedData = {};
      const scheme = this._config.get(`parsers:schemes:${this._source}`);

      //noinspection JSAnnotator
      for (const [key, value] of this._parseDataFactory(scheme)) {
        parsedData[key] = value;
      }

      return parsedData;
    }

    /**
     * Iterator which maps the resolved parsed data object properties based on scheme for specific source
     *
     * @param scheme - scheme
     * @private
     */
    *_parseDataFactory(scheme) {
      for (const key of Object.keys(scheme)) {

        const path = scheme[key];
        let resolvedPath;

        if (path === Object(path)) {
          // path is nested object
          let nestedObject = {};

          //noinspection JSAnnotator
          for (const [nestedKey, value] of this._parseDataFactory(path)) {
            nestedObject[nestedKey] = value;
          }

          resolvedPath = nestedObject;
        } else {
          resolvedPath = this._mapValueByPath(path);
        }

        yield [key, resolvedPath];
      }
    }

    /**
     * Resolves the property paths for mapping object that was created from scheme
     *
     * @param path
     * @returns {*}
     * @private
     */
    _mapValueByPath(path) {
      // TODO: connect lodash here if it would appear in this project
      let resolvedData = this._data;
      const pathArray = path.split(this._splitSymbol);

      for (const level of pathArray) {
        resolvedData = resolvedData[level];

        // if level doesn't exists return undefined
        if (resolvedData === undefined) {
          return;
        }
      }

      return resolvedData;
    }
  }

  /**
   * Returns new Parser object from provided source and data
   */
  return (source, data) => new Parser(source, data, config);
};
