/* eslint-disable @typescript-eslint/no-unused-vars,jest/require-to-throw-message */
import { HttpClient } from '../src';

const url = 'http://127.0.0.1:3000/';

const responseKey = Symbol('response');
const errorKey = Symbol('error');

const client = new HttpClient().setBaseUrl(url).intercepts({
	response: (res) => ({
		data: res.data,
		key: responseKey,
		ok: res.status === 200,
		status: res.status
	}),
	error: (err) => ({
		data: null,
		key: errorKey,
		status: err.response?.status || 400,
		ok: false
	})
});

describe('request interceptors', () => {
	it('throws an error when passed an object other than a function', () => {
		expect(() => {
			// @ts-expect-error
			new HttpClient().intercepts({ request: 'nope' });
		}).toThrow();
	});
});

describe('response interceptors', () => {
	it('sets a response interceptor', async () => {
		await client.get({ url: 'people/1' }, (response) => {
			expect(response.key).toBe(responseKey);
		});
	});

	it('throws an error when passed an object other than a function', () => {
		expect(() => {
			// @ts-expect-error
			new HttpClient().intercepts({ response: 'nope', error: () => {} });
		}).toThrow();
	});
});

describe('error interceptors', () => {
	it('sets an error interceptor', async () => {
		await client.get({ url: 'null' }, (response) => {
			expect(response.key).toBe(errorKey);
		});
	});

	it('throws an error when passed an object other than a function', () => {
		expect(() => {
			// @ts-expect-error
			new HttpClient().intercepts({ response: () => {}, error: 'nope' });
		}).toThrow();
	});
});

describe('interceptors when used in conjunction with serial requests', () => {
	it('resolves normalized responses to the expected format', async () => {
		const urls = [
			{ url: '/people/1' },
			{ url: '/people/2' },
			{ url: '/people/3' }
		];

		let iterations = 0;

		async function fetchAll() {
			for await (const response of client.serialGet(urls)) {
				expect(response).toHaveProperty('data');
				expect(response).toHaveProperty('status');
				expect(response).toHaveProperty('ok');

				expect(response.ok).toBe(true);

				// standard in Axios responses, expect this to have been filtered out
				expect(response).not.toHaveProperty('statusText');

				iterations++;
			}
		}

		await fetchAll();

		expect(iterations).toBe(urls.length);
	});
});

describe('optional interceptor passing', () => {
	it('sets an identity passthrough when passed an error interceptor without a response interceptor', async () => {
		const localClient = new HttpClient().setBaseUrl(url).intercepts({
			error: (_: any) => ({ ok: false })
		});

		async function fetch() {
			await localClient.get({ url: '/people/1' }, (response) => {
				expect(response).toHaveProperty('status');
				expect(response.status).toBe(200);
			});
		}

		await fetch();
	});

	it('sets an identity passthrough when passed a response interceptor without an error interceptor', async () => {
		const localClient = new HttpClient()
			.setBaseUrl(url)
			.intercepts({ response: (_: any) => ({ ok: true }) });

		async function fetch() {
			await localClient.get({ url: '1' }, ({ response }) => {
				expect(response).toHaveProperty('status');
				expect(response.status).toBe(404);
			});
		}

		await fetch();
	});
});
