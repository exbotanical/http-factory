'use strict';

import axios from 'axios';
import { notNullOrUndefined } from 'js-heuristics';

import {
  defaultOpts,
  logRequest,
  logResponse
} from './defaults';

import {
  mustBeBool,
  mustBeObj,
  mustBeFn,
  identity
} from './utils';

const clientKey = Symbol('@@_client');

class Base {
  constructor ({ opts = defaultOpts }) {
    if (this.constructor === Base) {
      throw new TypeError(`${this.constructor.name} cannot be instantiated directly`);
    }

    mustBeObj(opts);

    this[clientKey] = axios.create(opts);
  }

  transforms ({ request = [], response = [] } = {}) {
    this[clientKey].defaults.transformRequest.concat(request);
    this[clientKey].defaults.transformResponse.concat(response);

    return this;
  }

  intercepts ({ request, response, error } = {}) {
    const flags = {
      request: false,
      response: false
    };

    if (request) {
      mustBeFn(request);
      flags.request = true;
    }

    if (response) {
      mustBeFn(response);
      flags.response = true;

      if (!notNullOrUndefined(error)) error = identity;
    }

    if (error) {
      mustBeFn(error);

      if (!flags.response) {
        response = identity;
        flags.response = true;
      }
    }

    if (flags.request) this[clientKey].interceptors.request.use(request);

    if (flags.response) this[clientKey].interceptors.response.use(response, error);

    return this;
  }

  logs ({ request = true, response = true } = {}) {
    mustBeBool(request);
    mustBeBool(response);

    if (request) {
      this[clientKey].defaults.transformRequest =
        this[clientKey]
          .defaults
          .transformRequest
          .concat(logRequest);
    }

    if (response) {
      this[clientKey].defaults.transformResponse =
        this[clientKey]
        .defaults
        .transformResponse
        .concat(logResponse);
    }

    return this;
  }
}

export {
  Base,
  clientKey
};
