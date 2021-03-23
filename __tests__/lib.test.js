import HttpClient from '../lib';
import { defaultOpts } from '../lib/defaults';

// not testing axios here - that's covered by axios; let's just make sure the lib's api is working as expected

describe('Evaluation of default configurations', () => {
  it('sets explicitly designated headers', () => {});

  it('sets an explicitly designated base URL', async () => {
    client.setBaseUrl('https://jsonplaceholder.typicode.com/');
    // client.setBaseUrl('http://127.0.0.1:3000/'); // use local mock
    
    const response = await client.get({
      url: '/users/1'
      // url: 'people/1'  // use local mock
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
    expect(internal.defaults.headers['Content-Type']).toEqual(defaultOpts.headers['Content-Type']);
  });
});

// describe('Transformers assessment', () => {
//   describe('Evaluation of request transformers', () => {
//     it('sets a request transformer', () => {});
//     it('throws an error when passed an object other than a function or array thereof', () => {});

//   });

//   describe('Evaluation of response transformers', () => {
//     it('sets a response transformer', () => {});
//     it('throws an error when passed an object other than a function or array thereof', () => {});
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
