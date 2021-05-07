import { HttpClient } from '../lib';

const url = process.env.NODE_TEST_MODE
  ? 'http://127.0.0.1:3000/people/1'
  : 'https://jsonplaceholder.typicode.com/todos/1';

describe('Evaluation of request interceptors', () => {
  it('throws an error when passed an object other than a function', () => {
    expect(() => {
      new HttpClient()
        .intercepts({ request: 'nope' });
    }).toThrow();
  });
});

describe('Evaluation of response interceptors', () => {
  it('sets a response interceptor', async () => {
    const c = new HttpClient()
      .intercepts({ response: (res) => {
      if (res.status === 200) {
        return {
          ok: true,
          data: res.status.data,
          special: 'special'
        };
      }
    }, error: () => {}});

    await c.get({ url }, (response) => {
      expect(response.special).toBe('special');
    });
  });

  it('throws an error when passed an object other than a function', () => {
    expect(() => {
      new HttpClient()
        .intercepts({ response: 'nope', error: () => {} });
    }).toThrow();
  });
});

describe('Evaluation of error interceptors', () => {
  it('sets an error interceptor', async () => {
    const c = new HttpClient()
      .intercepts({ response: () => {}, error: (error) => {
        return {
          ok: false,
          special: 'special'
        };
    }});

    await c.get({ url: '' }, (response) => {
      expect(response.special).toBe('special');
    });

  });

  it('throws an error when passed an object other than a function', () => {
    expect(() => {
      new HttpClient()
        .intercepts({ response: () => {}, error: 'nope' });
    }).toThrow();
  });
});

describe('Evaluation of interceptors when used in conjunction with serial requests', () => {
  it('resolves normalized responses to the expected format', async () => {
    const urls = [{ url: '1' }, { url: '2'}, { url: '3' }];
    const error = _ => _;
    const response = ({ status, data }) => ({ status, data, ok: status === 200 });

    const c = new HttpClient()
      .intercepts({ response, error })
      .setBaseUrl('https://jsonplaceholder.typicode.com/todos/');

    const results = [];

    async function fetchAll () {
      for await (const response of c.serialGet(urls)) {
        results.push(response);
      }
    }

    await fetchAll();

    expect(results.length).toBe(urls.length);
    expect(results[0]).toHaveProperty('data');
    expect(results[0]).toHaveProperty('status');
    expect(results[0]).toHaveProperty('ok');

    expect(results[1].ok).toBe(true);

    // standard in Axios responses, expect this to have been filtered out
    expect(results[2]).not.toHaveProperty('statusText');
  });
});


describe('Evaluation of optional interceptor passing', () => {
  it('sets an identity passthrough when passed an error interceptor without a response interceptor', async () => {
    const error = _ => ({ ok: false });

    const c = new HttpClient()
      .intercepts({ error })
      .setBaseUrl('https://jsonplaceholder.typicode.com/todos/');

    async function fetch () {
      await c.get({ url: 'null' }, x => {
        expect(x).not.toBeInstanceOf(Error);
        expect(x).toHaveProperty('ok');
        expect(x.ok).toBe(false);
      });
    }

    await fetch();
  });

  it('sets an identity passthrough when passed a response interceptor without an error interceptor', async () => {
    const response = _ => ({ ok: true });

    const c = new HttpClient()
      .intercepts({ response })
      .setBaseUrl('https://jsonplaceholder.typicode.com/todos/');

    async function fetch () {
      await c.get({ url: '1' }, x => {
        expect(x).toHaveProperty('ok');
        expect(x.ok).toBe(true);
        expect(x).not.toHaveProperty('data');
        expect(x).not.toHaveProperty('status');
        expect(x).not.toHaveProperty('statusText');
      });
    }

    await fetch();
  });
});
