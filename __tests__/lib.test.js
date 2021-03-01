const { expect } = require("@jest/globals");
const HttpClient = require('../lib');
const { defaultOpts } = require('../lib/defaults');

// not testing axios here - that's covered by axios; let's just make sure the lib's api is working as expected

const url = 'http://127.0.0.1:3000/people/1';

describe('Base constructor assessment', () => {
  describe('Evaluation of response cycles', () => {
    it('should return 2xx response objects via the provided callback', () => {
      client.get({ url }, (response) => {
        expect(response.status).toBe(200);
      });
    });

    it('should return 2xx response objects via assignment', async () => {
      const response = await client.get({ url });
      
      expect(response.status).toBe(200);
    });

    it('should return 4xx error objects via the provided callback', async () => {
      await client.get({ url: '' }, (response) => {
        expect(response).toBeInstanceOf(Error);
      });
    });

    it('should return 4xx error objects via assignment', async () => {
      try {
        await client.get({ url: '' });
      } catch (ex) {
        expect(ex).toBeInstanceOf(Error);
      }
    });
  });

  describe('Evaluation of request method configurations', () => {
    it('should pass data', async () => {
      const response = await client.post({ 
        url: 'http://127.0.0.1:3000/people',
        data: {
          "name": "Egon Schiele",
          "id": "7"
        }
      });

      expect(response.status).toBe(201);
    });

    // it('should pass headers, overriding defaults', () => {});
  });

  describe('Evaluation of default configurations', () => {
    it('should set explicitly designated headers', () => {});

    it('should set an explicitly designated base URL', async () => {
      client.setBaseUrl('http://127.0.0.1:3000/');
      
      const response = await client.get({
        url: 'people/1'
      });

      expect(response.status).toBe(200);

      client.setBaseUrl('');
    });

    it('should throw an error when passed a non-string baseurl', () => {
      expect(() => client.setBaseUrl({})).toThrow();
    });

    it('should throw an error when constructor passed a non-object for base defaults', () => {
      expect(() => {
        new HttpClient([ 1, 2, 3 ])
      }).toThrow();
    });

    it('fallback to the default options when constructor passed nothing', () => {
      expect(internal.defaults.headers['Content-Type']).toEqual(defaultOpts.headers['Content-Type']);
    });
  });

describe('Interceptors assessment', () => {
  describe('Evaluation of request interceptors', () => {
  //   it('should set a request interceptor', () => {});
    it('should throw an error when passed an object other than a function', () => {
      expect(() => {
        new HttpClient()
          .intercepts({ request: 'nope' });
      }).toThrow();
    });
  });

  describe('Evaluation of response interceptors', () => {
    it('should set a response interceptor', async () => {
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

    it('should throw an error when passed an object other than a function', () => {
      expect(() => {
        new HttpClient()
          .intercepts({ response: 'nope', error: () => {} });
      }).toThrow();
    });
  });

  describe('Evaluation of error interceptors', () => {
    it('should set a error interceptor', async () => {
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
    it('should throw an error when passed an object other than a function', () => {
      expect(() => {
        new HttpClient()
          .intercepts({ response: () => {}, error: 'nope' });
      }).toThrow();
    });
  });
});

// describe('Transformers assessment', () => {
//   describe('Evaluation of request transformers', () => {
//     it('should set a request transformer', () => {});
//     it('should throw an error when passed an object other than a function or array thereof', () => {});

//   });

//   describe('Evaluation of response transformers', () => {
//     it('should set a response transformer', () => {});
//     it('should throw an error when passed an object other than a function or array thereof', () => {});
//   });
// });

// describe('Logger assessment', () => {
//   describe('Evaluation of loggers', () => {
//     it('toggle the request and response loggers', () => {});
//   });

//   describe('Evaluation of request logger', () => {
//     it('toggle the request logger', () => {});
//   });

//   describe('Evaluation of response transformers', () => {
//     it('toggle the response logger', () => {});
//   });
});