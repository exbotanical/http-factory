import { HttpClient } from '../lib';
import { clientKey } from '../lib/base';

beforeAll(() => {
  global.client = new HttpClient();
  global.internal = client[clientKey];
});
