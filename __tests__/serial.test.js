describe('Evaluation of serial GET -> [establish baseline]', () => {
  it('executes a valid GET request serially', async () => {
    const c = client.setBaseUrl('https://jsonplaceholder.typicode.com/users/');
    const urls = [{ url: '1' }, { url: '2' }, { url: '3' }];

    let iterations = 0;
    const results = new Proxy([], {
      get (target, prop, recv) {
        if (prop === 'push') iterations++;
        return Reflect.get(target, prop, recv);
      }
    });

    async function fetchAll () {
      try {
        for await (const response of c.serialGet(urls)) {
          results.push({ data: response.data });
        }
      } catch (ex) { }
    }

    await fetchAll();

    expect(iterations).toBe(urls.length);
    expect(results.length).toBe(urls.length);
    expect(results[0]).not.toBeUndefined();
  });

  it('resolves erroneous GET responses serially', async () => {
    const urls = [{ url: 'null' }, { url: 'null' }, { url: 'null' }];
    let e;
    async function fetchAll () {
      try {
        for await (const _ of client.serialGet(urls));
      } catch (ex) {
        e = ex;
      }
    }

    await fetchAll();

    expect(e).toBeInstanceOf(Error);
  });
});


describe('Evaluation of continuation passing style support', () => {
  it('invokes response callbacks - GET', async () => {
    const urls = [{ url: '1' }, { url: '2' }, { url: '3' }];

    let iterations = 0;
    const results = new Proxy([], {
      get (target, prop, recv) {
        if (prop === 'push') iterations++;
        return Reflect.get(target, prop, recv);
      }
    });

    const callback = ({ data }) => results.push(data);

    async function fetchAll () {
      for await (const _ of client.serialGet(urls, callback));
    }

    await fetchAll();

    expect(iterations).toBe(urls.length);
    expect(results.length).toBe(urls.length);
    expect(results[0]).not.toBeUndefined();
  });

  it('invokes response callbacks - POST', async () => {
    client.setBaseUrl('https://jsonplaceholder.typicode.com/posts/');
    const configs = [{ url: '', data: { t: '1' } }, { url: '', data: { t: '2' } }];

    let iterations = 0;
    const results = new Proxy([], {
      get (target, prop, recv) {
        if (prop === 'push') iterations++;
        return Reflect.get(target, prop, recv);
      }
    });

    const callback = ({ status }) => results.push({ status });

    async function fetchAll () {
      for await (const _ of client.serialPost(configs, callback));
    }

    await fetchAll();

    expect(iterations).toBe(configs.length);
    expect(results.length).toBe(configs.length);
    expect(results[0]).not.toBeUndefined();
    expect(results[0]).toHaveProperty('status');
    expect(results[1].status).toBe(201);
  });

  it('invokes error callbacks', async () => {
    const configs = [{ url: 'null', data: null }, { url: 'null', data: null }];

    let iterations = 0;
    const results = new Proxy([], {
      get (target, prop, recv) {
        if (prop === 'push') iterations++;
        return Reflect.get(target, prop, recv);
      }
    });

    const callback = ex => results.push(ex);

    async function fetchAll () {
      for await (const _ of client.serialPut(configs, callback));
    }

    await fetchAll();

    expect(iterations).toBe(configs.length);
    expect(results.length).toBe(configs.length);
    expect(results[0]).not.toBeUndefined();

    results.forEach(_ => {
      expect(_).toBeInstanceOf(Error);
    });
  });
});


describe('Evaluation of serial PUT', () => {
  it('executes a PUT request serially', async () => {
    const configs = process.env.NODE_TEST_MODE ? [{
        url: 'http://127.0.0.1:3000/people/6',
        data: { name: 'Egon Schiele' }
      },
      {
        url: 'http://127.0.0.1:3000/people/5',
        data: { name: 'Ludwig Wittgenstein' }
      }]
      :
      [{
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        data: { name: 'Egon Schiele' }
      }, {
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        data: { name: 'Egon Schiele' }
      }];

    let iterations = 0;
    const results = new Proxy([], {
      get (target, prop, recv) {
        if (prop === 'push') iterations++;
        return Reflect.get(target, prop, recv);
      }
    });

    async function putAll () {
      try {
        for await (const { status } of client.serialPut(configs)) {
          results.push({ status });
        }
      } catch (ex) { }
    }

    await putAll();

    expect(iterations).toBe(configs.length);
    expect(results.length).toBe(configs.length);
    expect(results[0]).not.toBeUndefined();

    results.forEach(({ status }) => {
      expect(status).toEqual(200);
    });
  });
});

describe('Evaluation of serial POST', () => {
  it('executes a POST request serially', async () => {
    const configs = process.env.NODE_TEST_MODE ? [{
        url: 'http://127.0.0.1:3000/people/',
        data: { name: 'Terry Riley', id: 8 }
      },
      {
        url: 'http://127.0.0.1:3000/people/',
        data: { name: 'Sion Sono', id: 9 }
      }]
      :
      [{
        url: 'https://jsonplaceholder.typicode.com/posts/',
        data: { a: 1 }
      }, {
        url: 'https://jsonplaceholder.typicode.com/posts/',
        data: { a: 1 }
      }];

    let iterations = 0;
    const results = new Proxy([], {
      get (target, prop, recv) {
        if (prop === 'push') iterations++;
        return Reflect.get(target, prop, recv);
      }
    });

    async function postAll () {
      try {
        for await (const { status } of client.serialPost(configs)) {
          results.push({ status });
        }
      } catch (ex) { }
    }

    await postAll();

    expect(iterations).toBe(configs.length);
    expect(results.length).toBe(configs.length);
    expect(results[0]).not.toBeUndefined();

    results.forEach(({ status }) => {
      expect(status).toEqual(201);
    });
  });

});

describe('Evaluation of serial DELETE', () => {
  it('executes a DELETE request serially', async () => {
    const configs = process.env.NODE_TEST_MODE ? [
      { url: 'http://127.0.0.1:3000/people/8' },
      { url: 'http://127.0.0.1:3000/people/9' }]
      :
      [{ url: 'https://jsonplaceholder.typicode.com/posts/1' },
      { url: 'https://jsonplaceholder.typicode.com/posts/1' }];

    let iterations = 0;
    const results = new Proxy([], {
      get (target, prop, recv) {
        if (prop === 'push') iterations++;
        return Reflect.get(target, prop, recv);
      }
    });

    async function deleteAll () {
      try {
        for await (const { status } of client.serialDelete(configs)) {
          results.push({ status });
        }
      } catch (ex) { }
    }

    await deleteAll();

    expect(iterations).toBe(configs.length);
    expect(results.length).toBe(configs.length);
    expect(results[0]).not.toBeUndefined();

    results.forEach(({ status }) => {
      expect(status).toEqual(200);
    });
  });
});

describe('Evaluation of Error processing with fail-fast behavior', () => {
  describe('Evaluation of serial PUT errors', () => {
    it('processes a PUT request error serially', async () => {
      client.setBaseUrl('null');
      const configs = [{
          url: 'null',
          data: { name: 'Egon Schiele' }
        },
        {
          url: 'null',
          data: { name: 'Ludwig Wittgenstein' }
        }];

      let iterations = 0;
      const errors = new Proxy([], {
        get (target, prop, recv) {
          if (prop === 'push') iterations++;
          return Reflect.get(target, prop, recv);
        }
      });

      async function putAll () {
        try {
          for await (const _ of client.serialPut(configs));
        } catch (ex) {
          errors.push(ex);
        }
      }

      await putAll();

      expect(iterations).toBe(1);
      expect(errors.length).toBe(1);
      expect(errors[0]).not.toBeUndefined();

      expect(errors[0]).toBeInstanceOf(Error);
    });
  });

  describe('Evaluation of serial POST errors', () => {
    it('processes a POST request error serially', async () => {
      client.setBaseUrl('null');
      const configs = [{
          url: 'null',
          data: { name: 'Terry Riley', id: 8 }
        },
        {
          url: 'null',
          data: { name: 'Sion Sono', id: 9 }
        }];

      let iterations = 0;
      const errors = new Proxy([], {
        get (target, prop, recv) {
          if (prop === 'push') iterations++;
          return Reflect.get(target, prop, recv);
        }
      });

      async function postAll () {
        try {
          for await (const _ of client.serialPost(configs));
        } catch (ex) { errors.push(ex); }
      }

      await postAll();

      expect(iterations).toBe(1);
      expect(errors.length).toBe(1);
      expect(errors[0]).not.toBeUndefined();

      expect(errors[0]).toBeInstanceOf(Error);
    });

  });

  describe('Evaluation of serial DELETE errors', () => {
    it('processes a DELETE request error serially', async () => {
      client.setBaseUrl('null');
      const configs = [
        { url: 'null' },
        { url: 'null' }];

      let iterations = 0;
      const errors = new Proxy([], {
        get (target, prop, recv) {
          if (prop === 'push') iterations++;
          return Reflect.get(target, prop, recv);
        }
      });

      async function deleteAll () {
        try {
          for await (const _ of client.serialDelete(configs));
        } catch (ex) { errors.push(ex); }
      }

      await deleteAll();

      expect(iterations).toBe(1);
      expect(errors.length).toBe(1);
      expect(errors[0]).not.toBeUndefined();

      expect(errors[0]).toBeInstanceOf(Error);
    });
  });
});

describe('Evaluation of Error processing via continuations', () => {
  it('should resolve errors lazily when using continuation passing style', async () => {
    const urls = [{ url: 'null' }, { url: 'null' }];

    let iterations = 0;
    const errors = new Proxy([], {
      get (target, prop, recv) {
        if (prop === 'push') iterations++;
        return Reflect.get(target, prop, recv);
      }
    });

    const callback = ex => errors.push(ex);

    async function fetchAll () {
      for await (const _ of client.serialGet(urls, callback));
    }

    await fetchAll();

    expect(iterations).toBe(urls.length);
    expect(errors.length).toBe(urls.length);
    expect(errors[0]).not.toBeUndefined();
    // workaround - Jest cannot evaluate the Error item as an instance of Error
    expect(errors[0].constructor.name).toBe(Error().constructor.name);
  });
});
