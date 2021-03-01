'use strict';

function logRequest (data, headers) {
  const printf = 'color: #4CAF50; font-weight: bold';

  if (data /* TODO typecheck */ && Object.keys(data).length > 0) console.log('%c REQUEST: DATA ===> ', printf, { data });
  console.log('%c REQUEST: HEADERS ===> ', printf, { headers });

  return data;
}

function logResponse (data) {
  const printf = 'color: #4CAF50; font-weight: bold';

  console.log('%c RESPONSE: DATA ===> ', printf, data);

  return data;
}

const defaultOpts = {
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
};

module.exports = {
  logRequest,
  logResponse,
  defaultOpts
};