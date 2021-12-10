/* eslint-disable jest/no-conditional-expect */
import { HttpClient } from '../src';

const url = 'http://127.0.0.1:3000/people/1';

describe('response cycles', () => {
	it('returns 2xx response objects via the provided callback', () => {
		const client = new HttpClient();

		client.get<{ status: number }>({ url }, (response) => {
			expect(response.status).toBe(200);
		});
	});

	it('returns 2xx response objects via assignment', async () => {
		const client = new HttpClient();

		const response = await client.get({ url });

		expect(response.status).toBe(200);
	});

	it('returns 4xx error objects via the provided callback', async () => {
		const client = new HttpClient();

		await client.get({ url: '' }, (response) => {
			expect(response).toBeInstanceOf(Error);
		});
	});

	it('returns 4xx error objects via assignment', async () => {
		const client = new HttpClient();

		try {
			await client.get({ url: '' });
		} catch (ex) {
			expect(ex).toBeInstanceOf(Error);
		}
	});
});

describe('required argument types', () => {
	it('throws an error when passed a non-function callback', async () => {
		const client = new HttpClient();

		try {
			// @ts-expect-error
			await client.get({ url }, 'not_a_callback');
		} catch (ex) {
			expect(ex).toBeInstanceOf(Error);
		}
	});
});

describe('request method configurations', () => {
	it('should pass data', async () => {
		const client = new HttpClient();

		const response = await client.post({
			url: 'http://127.0.0.1:3000/people',
			data: {
				name: 'Egon Schiele',
				id: '7'
			}
		});

		expect(response.status).toBe(201);
	});
});
