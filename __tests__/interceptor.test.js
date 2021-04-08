import HttpClient from '../lib';

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
