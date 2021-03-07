## http-factory | A Declarative Http Interface Factory
A declarative way to instantiate http interfaces and make iterable requests.

```
var client = new HttpClient({ ...options })
  .transforms({
    request: fn,
    response: fn
  })
  .intercepts({
    request: fn,
    response: fn,
    error: fn
  })
  .logs({
    request: true,
    response: true
  })
  .setBaseUrl('...');

var results = [];
var urls : [{ url: '/users/1 }, { url: '/users/2' }, {  url: '/users/3' }];

async function fetchAll () {
  for await (var response of client.serialGet(urls)) {
    results.push({ data: response.data.id });
    // [ { data: 1 } ]
    // [ { data: 1 }, { data: 2 } ]
    // [ { data: 1 }, { data: 2 }, { data: 3 } ]
  }
}
```
