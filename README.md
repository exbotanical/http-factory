# http-factory

## A Declarative Http Interface Factory

[![Build Status](https://travis-ci.org/MatthewZito/http-factory.svg?branch=master)](https://travis-ci.org/MatthewZito/http-factory)
[![npm version](https://badge.fury.io/js/http-factory.svg)](https://badge.fury.io/js/http-factory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


`http-factory` is an NPM library and Axios-wrapper that offers a declarative way to instantiate http interfaces and make iterable (serial async) requests.

```js
const data = [];

for await (const rs of client.serialGet(urls)) {
  if (rs.status === 200) data.push({ data: rs.data });
...
```

See the API docs below for instantiating clients, dev logging, and making iterable requests.

For client options see [Axios docs](https://github.com/axios/axios).

## Table of Contents

- [Supported Environments](#builds)
- [Installation + Usage](#usage)
- [Documentation / API](#docs)
  - [Core API](#api)
    - [setBaseUrl](#setbaseurl)
    - [intercepts](#intercept)
    - [transforms](#transform)
    - [logs](#log)
  - [Iterable Requests](#serial)
  - [Continuation Passing + Callbacks](#cps)

## <a name="builds"></a> Supported Environments

`http-factory` currently supports UMD, CommonJS (node versions >= 10), and ESM build-targets. Is your preferred build not supported? Open an issue!


## <a name="usage"></a> Installation + Usage

```bash
npm install http-factory
# OR
yarn add http-factory
```

Commonjs:

```js
const httpClient = require('http-factory');
```

ESM:

```js
import httpClient from 'http-factory';
```

## <a name="docs"></a> Documentation

By default, requests are sent with a Content-Type header of application/json. UTF-8 encoding is set by default, and all request bodies will be serialized.

To change this behavior, you can provide your own Axios options to the constructor:

```js
const client = new HttpClient({ baseURL: 'https://some-domain.com/api/' });
```

You can chain interceptors, transformers, and dev loggers onto the client object:

```js
const client = new HttpClient({ ...options })
  .transforms({ request: fn, response: fn })
  .intercepts({ request: fn, response: fn, error: fn })
  .logs({ request: true, response: true })
  .setBaseUrl('...');
```

**Note** Interceptors expect response and error handlers to be passed together.


### <a name="api"></a> Core API

#### <a name="setbaseurl"></a> setBaseUrl(url: string)

*set a base URL for the given client instance*

**Example**

```js
const client = new HttpClient({ ...options })
  .setBaseUrl('https://website.com/api');
```

#### <a name="intercept"></a> intercepts({ request: Function, response: Function, error: Function })

*register handlers for intercepting request / response*

Expects named arguments to which request, response, and error interceptors will be passed.

**Note** Response and error each require the other. This will be fixed in v1.0.3

**Example**

```js
import { request, response, error } from './interceptors';

const client = new HttpClient({ ...options })
  .intercepts({ request, response, error });
```

#### <a name="transform"></a> transforms({ request: (Function|Function[]), response: (Function|Function[]) })

*register request / response transformers*

Executes handlers on inbound / outbound request objects; fires before interceptors. Accepts Function or array thereof.

Transformers are invoked *before* interceptors and automatically deserialize responses, where applicable.

**Example**

```js
import { request, response } from './transformers';

const client = new HttpClient({ ...options })
  .transforms({ request, response });
```

#### <a name="log"></a> logs({ request: boolean, response: boolean })

*toggle request/response logging*

Specify whether you want to log the request and / or response headers and data.

**Example**

```js
const isDevEnv = process.env.NODE_ENV === 'development';

const client = new HttpClient({ ...options })
  .logs({ request: isDevEnv, response: isDevEnv }); // logs request / response to console in dev env
```

### <a name="serial"></a> Iterable Requests

Iterable requests allow the execution of *n* HTTP requests serially. Note these methods have fail-fast behaviors - much akin to `Promise.all`, if one of the requests fails, the chain stops. It is recommended to either use `try...catch` blocks around these iterations, or `client.intercepts({ ... })` to process erroneous responses.

In order to bypass fail-fast behavior and lazily collect all erroneous responses, use continuation-passing style by [passing a callback](#cps). Errors will be instances of the Error constructor whereas Http requests with a 4xx status will be regular objects.

#### serialGet(config: object[], cb: Function)

*execute an iterable request, awaiting each result in sequence*

Pass an array of objects (each a GET config) and iterate over the results as they resolve (or reject).

**Example**

```js
const client = new HttpClient({ ...options });


const results = [];
const urls : [{ url: '/users/1' }, { url: '/users/2' }, {  url: '/users/3' }];

async function fetchAll () {
  for await (const response of client.serialGet(urls)) {
    try {
      if (response.status === 200) results.push({ data: response.data.id });
      // [ { data: 1 } ]
      // [ { data: 1 }, { data: 2 } ]
      // [ { data: 1 }, { data: 2 }, { data: 3 } ]
      ...
  }
}
```

#### serialPost(config: object[], cb: Function)

*execute an iterable request, awaiting each result in sequence*

Pass an array of objects (each a POST config) and iterate over the results as they resolve (or reject).

**Example**

```js
...
async function postAll () {
  for await (const { status } of client.serialPost(configs)) {
    try {
      if (status === 201) results.push({ ok: true });
      // [ { ok: true } ]
      // [ { ok: true }, { ok: true  } ]
      // [ { ok: true }, { ok: true  }, { ok: true } ]
    } catch (ex) {
      results.push({ ok: false });
    }
    ...
  }
  ...
}
```

#### serialPut(config: object[], cb: Function)

*execute an iterable request, awaiting each result in sequence*

Pass an array of objects (each a PUT config) and iterate over the results as they resolve (or reject).

**Example**

```js
const client = new HttpClient({ ...options });


const results = [];

const configs = [{
    url: 'http://database/people/6',
    data: { name: 'Egon Schiele' }
  },
  {
    url: 'http://database/people/5',
    data: { name: 'Ludwig Wittgenstein' }
  },
  { ... }
];

async function putAll () {
  for await (const { status } of client.serialPut(configs)) {
    try {
      if (status === 204) results.push({ ok: true });
      // [ { ok: true } ]
      // [ { ok: true }, { ok: true  } ]
      // [ { ok: true }, { ok: true  }, { ok: true } ]
    } catch (ex) {
      results.push({ ok: false });
    }
    ...
  }
  ...
  const success = results.reduce((acc, { ok }) => acc = !!ok && true);
}
```

#### serialDelete(config: object[], cb: Function)

*execute an iterable request, awaiting each result in sequence*

Pass an array of objects (each a DELETE config) and iterate over the results as they resolve (or reject).

**Example**

```js
...
async function deleteAll () {
  for await (const { status } of client.serialDelete(configs)) {
    try {
      if (status === 204) results.push({ ok: true });
      // [ { ok: true } ]
      // [ { ok: true }, { ok: true  } ]
      // [ { ok: true }, { ok: true  }, { ok: true } ]
    } catch (ex) {
      results.push({ ok: false });
    }
    ...
  }
  ...
}
```

### <a name="cps"></a> Continuations / Callbacks

Each request method accepts an optional callback to which the response or error will be piped. This affords the use of continuation-passing using callbacks:

**Example**

```js
async function getData () {
  await client.getTheData({ url }, ({ ok, data }) => {
    if (ok) this.data = data;
    else ...
  });
}
```

Continuations can likewise be passed to serial requests:

**Serial Request Example**

```js
...
const callback = ({ data }) => results.push(data);

async function fetchAll () {
  try {
    for await (const _ of client.serialGet(urls, callback));
  } catch(ex) { ... }
}
...
```
