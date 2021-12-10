# http-factory

[![Coverage Status](https://coveralls.io/repos/github/MatthewZito/http-factory/badge.svg?branch=master)](https://coveralls.io/github/MatthewZito/http-factory?branch=master)
[![Continuous Deployment](https://github.com/MatthewZito/http-factory/actions/workflows/cd.yml/badge.svg)](https://github.com/MatthewZito/http-factory/actions/workflows/cd.yml)
[![Continuous Integration](https://github.com/MatthewZito/http-factory/actions/workflows/ci.yml/badge.svg)](https://github.com/MatthewZito/http-factory/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/http-factory.svg)](https://badge.fury.io/js/http-factory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`http-factory` lets you build declarative, strongly-typed http interfaces

- [Install](#install)
- [Supported Environments](#support)
- [Documentation / API](#docs)

```ts
const client = new HttpClient({ ...options })
  // transform the outbound request / inbound response
  .transforms({ request: fn, response: fn })
  // intercept the outbound request / inbound response or error
  .intercepts({ request: fn, response: fn, error: fn })
  // log the outbound request / inbound response
  .logs({ request: isDev, response: isDev })
  // set the base url for the client instance
  .setBaseUrl('...');

// make a serial request
const data = [];

for await (const rs of client.serialGet(urls)) {
  if (rs.status === 200) data.push({ data: rs.data });
...
```

By default, requests are sent with a Content-Type header of application/json. UTF-8 encoding is set by default, and all request bodies will be serialized.

To change this behavior, you can provide your own Axios options to the constructor.

Each request method accepts an optional callback to which the response or error will be piped. This affords the use of continuation-passing using callbacks:

```ts
...
client.intercepts({
  request: ({ data }) => ({ ok: true, data }),
  error: (err) => ({ ok: false, data: null, message: err.response.data.msg || 'something went wrong' }),
});

async function getData () {
  await client.getTheData({ url }, ({ ok, data }) => {
    if (ok) {
      // didn't have to do a bunch of response normalization in my component, yay
    } else {
      // handle
    }
  });
}
```

Continuations can likewise be passed to serial requests:

```ts
...
const callback = ({ data }) => results.push(data);

async function fetchAll () {
  try {
    for await (const _ of client.serialGet(urls, callback));
  } catch(ex) { ... }
}
...
```

See the API docs below for instantiating clients, dev logging, and making iterable requests.

For client options see [Axios docs](https://github.com/axios/axios).

## <a name="install"></a> Installation

```bash
npm install http-factory
```

OR

```bash
yarn add http-factory
```

## <a name="support"></a>  Supported Environments

`http-factory` currently supports UMD, CommonJS (node versions >= 10), and ESM build-targets

Commonjs:

```ts
const { HttpClient } = require('http-factory');
```

ESM:

```ts
import { HttpClient } from 'http-factory';
```

## <a name="docs"></a> Documentation

Full documentation can be found [here](https://matthewzito.github.io/http-factory/http-factory.html)
