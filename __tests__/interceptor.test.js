import HttpClient from '../lib';

const url = 'https://jsonplaceholder.typicode.com/todos/1';
// const url = 'http://127.0.0.1:3000/people/1'; // use local mock

describe('Evaluation of request interceptors', () => {
  //   it('sets an request interceptor', () => {});
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
