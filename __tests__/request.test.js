const isLocalMode = process.env.NODE_TEST_MODE;

const url = isLocalMode
  ? 'http://127.0.0.1:3000/people/1'
  : 'https://jsonplaceholder.typicode.com/todos/1';

describe('Evaluation of response cycles', () => {
  it('returns 2xx response objects via the provided callback', () => {
    client.get({ url }, (response) => {
      expect(response.status).toBe(200);
    });
  });

  it('returns 2xx response objects via assignment', async () => {
    const response = await client.get({ url });
    
    expect(response.status).toBe(200);
  });

  it('returns 4xx error objects via the provided callback', async () => {
    await client.get({ url: '' }, (response) => {
      expect(response).toBeInstanceOf(Error);
    });
  });

  it('returns 4xx error objects via assignment', async () => {
    try {
      await client.get({ url: '' });
    } catch (ex) {
      expect(ex).toBeInstanceOf(Error);
    }
  });
});

describe('Evaluation of required argument types', () => {
  it('throws an error when passed a non-function callback', async () => {
    try {
      await client.get({ url }, 'not_a_callback');
    } catch (ex) {
      expect(ex).toBeInstanceOf(Error);
    }
  });
});

if (isLocalMode) {
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
  });
}
