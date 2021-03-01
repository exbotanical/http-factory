const { exec } = require("child_process");
const { stdout } = require("process");

const HttpClient = require('../lib');
const { clientKey } = require('../lib/base');

// var client, 
//   internal;

beforeAll(() => {
  global.client = new HttpClient();
  global.internal = client[clientKey];
});