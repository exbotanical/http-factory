'use strict';

const axios = require('axios');

const {
  defaultOpts,
  logRequest,
  logResponse
} = require('./defaults');

const {
  mustBeBool,
  mustBeFn,
  mustBeObj,
  mustBeStr
} = require('./utils');

const clientKey = Symbol('@@_client');

class Base {
  constructor({ opts = defaultOpts }) {
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

  intercepts ({ request, response, error /* TODO typecheck */ } = {}) {
    this[clientKey].interceptors.request.use(request);
    this[clientKey].interceptors.response.use(response, error);

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

module.exports = {
  Base,
  clientKey
};