import { HttpClient } from '../src';

const url = 'http://127.0.0.1:3000/';
const client = new HttpClient().setBaseUrl(url);

describe('default configurations', () => {
	it.todo('sets explicitly designated headers');

	it('sets an explicitly designated base URL', async () => {
		const localUrl = 'http://127.0.0.1:3000/people/1';
		const localClient = new HttpClient();

		localClient.setBaseUrl(localUrl);
		const response = await localClient.get();

		expect(response.status).toBe(200);
	});

	it('throws an error when passed a non-string baseurl', () => {
		const localClient = new HttpClient();
		// @ts-expect-error
		expect(() => localClient.setBaseUrl({})).toThrow();
	});

	it('throws an error when constructor passed a non-object for base defaults', () => {
		expect(() => {
			// @ts-expect-error
			new HttpClient([1, 2, 3]); // eslint-disable-line no-new
		}).toThrow();
	});
});

describe('continuation passing style support', () => {
	it('invokes response callbacks', async () => {
		await client.get<{ status: number }>(
			{
				url: 'people/1'
			},
			({ status }) => {
				expect(status).toBe(200);
			}
		);
	});

	it('invokes error callbacks', async () => {
		await client.get(
			{
				url: ''
			},
			({ message }) => {
				expect(message).toBeDefined();
			}
		);
	});

	it('throws a contract violation if not provided a function', async () => {
		// @ts-expect-error
		expect(() => client.get({ url: 'people/1' }, '')).toThrow();
		// @ts-expect-error
		expect(() => client.post({ url: 'people/1' }, '')).toThrow();
		// @ts-expect-error
		expect(() => client.put({ url: 'people/1' }, '')).toThrow();
		// @ts-expect-error
		expect(() => client.delete({ url: 'people/1' }, '')).toThrow();
	});
});

describe('method wrapping', () => {
	it('should wrap internal CRUD methods', async () => {
		const ret = { ok: true };
		const localClient = new HttpClient().setBaseUrl(url).intercepts({
			response: () => ret
		});

		const unresolved = localClient.get({ url: 'people/1' });

		expect(unresolved).toBeInstanceOf(Promise);
		await expect(unresolved).resolves.toStrictEqual(ret);
	});
});
