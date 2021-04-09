import HttpClient from '../lib';
import { defaultOpts } from '../lib/defaults';

// not testing axios here - that's covered by axios; let's just make sure the lib's api is working as expected
const isLocalMode = process.env.NODE_TEST_MODE;

describe('Evaluation of default configurations', () => {
  it('sets explicitly designated headers', () => {});

  it('sets an explicitly designated base URL', async () => {
    client.setBaseUrl(
      isLocalMode
        ? 'http://127.0.0.1:3000/'
        :'https://jsonplaceholder.typicode.com/'
    );

    const response = await client.get({
      url: isLocalMode ? 'people/1' : '/users/1'
    });

    expect(response.status).toBe(200);

    client.setBaseUrl('');
  });

  it('throws an error when passed a non-string baseurl', () => {
    expect(() => client.setBaseUrl({})).toThrow();
  });

  it('throws an error when constructor passed a non-object for base defaults', () => {
    expect(() => {
      new HttpClient([ 1, 2, 3 ])
    }).toThrow();
  });

  it('falls back to the default options when constructor passed nothing', () => {
    expect(internal.defaults.headers['Content-Type'])
      .toEqual(defaultOpts.headers['Content-Type']);
  });
});

describe('Evaluation of continuation passing style support', () => {
  it('invokes response callbacks', async () => {
    client.setBaseUrl(
      isLocalMode
        ? 'http://127.0.0.1:3000/'
        :'https://jsonplaceholder.typicode.com/'
    );

    await client.get({
      url: isLocalMode ? 'people/1' : '/users/1'
    }, ({ status }) => {
      expect(status).toBe(200);
    });
  });

  it('invokes error callbacks', async () => {
    client.setBaseUrl('');

    await client.get({
      url: ''
    }, ({ message }) => {
      expect(message).not.toBeUndefined();
    });
  });

  it('throws a contract violation if not provided a function', async () => {
    client.setBaseUrl('https://jsonplaceholder.typicode.com/');
    expect(() => client.get({ url: 'users/1' }, '')).toThrow();
    expect(() => client.post({ url: 'users/1' }, '')).toThrow();
    expect(() => client.put({ url: 'users/1' }, '')).toThrow();
    expect(() => client.delete({ url: 'users/1' }, '')).toThrow();
  });
});

describe('Evaluation of method wrapping', () => {
  it('should wrap internal CRUD methods', async () => {
    client.setBaseUrl('https://jsonplaceholder.typicode.com/');

    const unresolved = client.get({ url: 'users/1' });
    expect(unresolved).toBeInstanceOf(Promise);
    expect(await unresolved).not.toBeUndefined();
  });
});

