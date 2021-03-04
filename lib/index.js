'use strict';

import {
  Base,
  clientKey
} from './base';

import { mustBeStr, mustBeFn } from './utils';

/**
 * @description Factory for creating new Axios clients
 * @extends Base
 */
class HttpClient extends Base {
  /**
   * @param {*} opts Default configurations
   */
  constructor (opts) {
    super({ opts });
  }

  /**
   * @summary Set a base URL for the instance
   * @param {string} url The target endpoint base URL
   */
  setBaseUrl (url) {
    mustBeStr(url);
    this[clientKey].defaults.baseURL = url;

    return this;
  }

  /**
   * @summary Send a GET request
   * @param {object} conf Config - same as Axios configurations sans `method`
   * @param {function} cb An optional callback that processes the response object
   */
  get (conf, cb) {
    if (cb) mustBeFn(cb);

    return this[clientKey]({
      method: 'get',
      ...conf
    }).then(cb)
      .catch(cb);
  }

  /**
   * @summary Send a POST request
   * @param {object} conf Config - same as Axios configurations sans `method`
   * @param {function} cb An optional callback that processes the response object
   */
  post (conf, cb) {
    if (cb) mustBeFn(cb);

    return this[clientKey]({
      method: 'post',
      ...conf
    }).then(cb)
      .catch(cb);
  }

  /**
   * @summary Send a PUT request
   * @param {object} conf Config - same as Axios configurations sans `method`
   * @param {function} cb An optional callback that processes the response object
   */
  put (conf, cb) {
    if (cb) mustBeFn(cb);

    return this[clientKey]({
      method: 'put',
      ...conf
    }).then(cb)
      .catch(cb);
  }

  /**
   * @summary Send a DELETE request
   * @param {object} conf Config - same as Axios configurations sans `method`
   * @param {function} cb An optional callback that processes the response object
   */
  delete (conf, cb) {
    if (cb) mustBeFn(cb);

    return this[clientKey]({
      method: 'delete',
      ...conf
    }).then(cb)
      .catch(cb);
  }

  /**
   * @summary Send a GET request that executes serially
   * @param {object} conf Config - same as Axios configurations sans `method`
   * @example for await (let response of client.serialGet([{ url: '/url1' }, { url:'/url2' }]) ...
   */
  async *serialGet (conf, cb) {
    if (cb) mustBeFn(cb);

    for (const config of conf) {
      try {
        const response = await this.get(config);
        
        if (cb) yield cb(response);
        else yield response;
      } catch (ex) {
        if (cb) yield cb(ex);
        else yield ex;
      }
    }
  }
}

export default HttpClient;
