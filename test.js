const HttpClient = require('./lib');

const client = new HttpClient()
  .logs({ request: false });

async function fetchIt () {
  await client.get({
    url: 'https://jsonplaceholder.typicode.com/todos/1'
  }, ({ data }) => console.log({ data }));

}

fetchIt();
