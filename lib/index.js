'use strict';

import axios from 'axios';
import { notNullOrUndefined } from 'js-heuristics';

import {
  Base,
  clientKey
} from './base';

import {
  mustBeStr,
  mustBeFn
} from './utils';

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
    if (notNullOrUndefined(cb)) mustBeFn(cb);

    /* istanbul ignore next */
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
    if (notNullOrUndefined(cb)) mustBeFn(cb);

    /* istanbul ignore next */
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
    if (notNullOrUndefined(cb)) mustBeFn(cb);

    /* istanbul ignore next */
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
    if (notNullOrUndefined(cb)) mustBeFn(cb);

    /* istanbul ignore next */
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
    // throw error now in lieu of letting it propagate at underlying method
    if (notNullOrUndefined(cb)) mustBeFn(cb);

    for (const config of conf) {
      try {
        const response = await this.get(config);

        if (cb) yield cb(response);
        else yield response;
      } catch (ex) {
        if (cb) yield cb(ex);
        else yield new Promise((_, reject) => reject(new Error(ex)));
      }
    }
  }

  /**
   * @summary Send a POST request that executes serially
   * @param {object} conf Config - same as Axios configurations sans `method`
   * @example for await (let response of client.serialPost(configs) ...
   */
  async *serialPost (conf, cb) {
    if (notNullOrUndefined(cb)) mustBeFn(cb);

    for (const config of conf) {
      try {
        const response = await this.post(config);

        if (cb) yield cb(response);
        else yield response;
      } catch (ex) {
        if (cb) yield cb(ex);
        else yield new Promise((_, reject) => reject(new Error(ex)));
      }
    }
  }

  /**
   * @summary Send a PUT request that executes serially
   * @param {object} conf Config - same as Axios configurations sans `method`
   * @example for await (let response of client.serialPut(configs) ...
   */
  async *serialPut (conf, cb) {
    if (notNullOrUndefined(cb)) mustBeFn(cb);

    for (const config of conf) {
      try {
        const response = await this.put(config);

        if (cb) yield cb(response);
        else yield response;
      } catch (ex) {
        if (cb) yield cb(ex);
        else yield new Promise((_, reject) => reject(new Error(ex)));
      }
    }
  }

  /**
   * @summary Send a DELETE request that executes serially
   * @param {object} conf Config - same as Axios configurations sans `method`
   * @example for await (let response of client.serialDelete(configs) ...
   */
  async *serialDelete (conf, cb) {
    if (notNullOrUndefined(cb)) mustBeFn(cb);

    for (const config of conf) {
      try {
        const response = await this.delete(config);

        if (cb) yield cb(response);
        else yield response;
      } catch (ex) {
        if (cb) yield cb(ex);
        else yield new Promise((_, reject) => reject(new Error(ex)));
      }
    }
  }
}

const CancelToken = axios.CancelToken;

export {
  HttpClient,
  CancelToken
};
