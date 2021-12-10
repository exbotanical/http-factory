/* eslint-disable @typescript-eslint/no-unused-vars,jest/no-conditional-expect,no-empty */
import { HttpClient } from '../src';

const url = 'http://127.0.0.1:3000/';
const client = new HttpClient().setBaseUrl(url);

describe('serial GET -> [establish baseline]', () => {
	it('executes a valid GET request serially', async () => {
		const urls = [
			{ url: 'people/1' },
			{ url: 'people/2' },
			{ url: 'people/3' }
		];

		let iterations = 0;

		async function fetchAll() {
			try {
				for await (const response of client.serialGet(urls)) {
					expect(response).toBeDefined();

					iterations++;
				}
			} catch (ex: any) {}
		}

		await fetchAll();

		expect(iterations).toBe(urls.length);
	});

	it('resolves erroneous GET responses serially', async () => {
		const localClient = new HttpClient();

		const urls = [{ url: 'null' }, { url: 'null' }, { url: 'null' }];

		async function fetchAll() {
			try {
				for await (const _ of localClient.serialGet(urls));
			} catch (ex: any) {
				expect(ex).toBeInstanceOf(Error);
			}
		}

		await fetchAll();
	});
});

describe('continuation passing style support', () => {
	it('invokes response callbacks - GET', async () => {
		const urls = [
			{ url: '/people/1' },
			{ url: '/people/2' },
			{ url: '/people/3' }
		];

		let iterations = 0;

		async function fetchAll() {
			for await (const _ of client.serialGet(urls, (rs) => {
				expect(rs).toHaveProperty('status');

				iterations++;
			}));
		}

		await fetchAll();

		expect(iterations).toBe(urls.length);
	});

	it('invokes response callbacks - POST', async () => {
		const configs = [
			{ url: '/people', data: { name: 'Sion Sono', id: 20 } },
			{ url: '/people', data: { name: 'Sion Sono', id: 21 } }
		];

		let iterations = 0;

		async function fetchAll() {
			for await (const _ of client.serialPost(configs, (rs) => {
				iterations++;

				expect(rs).toBeDefined();
				expect(rs).toHaveProperty('status');
				expect(rs.status).toBe(201);
			}));
		}

		await fetchAll();

		expect(iterations).toStrictEqual(configs.length);
	});

	it('invokes error callbacks', async () => {
		const localClient = new HttpClient();

		const configs = [
			{ url: 'null', data: null },
			{ url: 'null', data: null }
		];

		let iterations = 0;

		async function fetchAll() {
			for await (const _ of localClient.serialPut(configs, (rs) => {
				iterations++;

				expect(rs).toBeDefined();

				// workaround - Jest cannot evaluate the Error item as an instance of Error
				expect(rs.constructor.name).toStrictEqual(Error().constructor.name);
			}));
		}

		await fetchAll();

		expect(iterations).toStrictEqual(configs.length);
	});
});

describe('serial PUT', () => {
	it('executes a PUT request serially', async () => {
		const configs = [
			{
				url: '/people/6',
				data: { name: 'Egon Schiele' }
			},
			{
				url: '/people/5',
				data: { name: 'Ludwig Wittgenstein' }
			}
		];

		let iterations = 0;

		async function putAll() {
			try {
				for await (const { status } of client.serialPut(configs)) {
					iterations++;

					expect(status).toBe(200);
				}
			} catch (ex: any) {}
		}

		await putAll();

		expect(iterations).toStrictEqual(configs.length);
	});
});

describe('serial POST', () => {
	it('executes a POST request serially', async () => {
		const configs = [
			{
				url: '/people',
				data: { name: 'Terry Riley', id: 8 }
			},
			{
				url: '/people',
				data: { name: 'Sion Sono', id: 9 }
			}
		];

		let iterations = 0;

		async function postAll() {
			try {
				for await (const { status } of client.serialPost(configs)) {
					iterations++;

					expect(status).toBe(201);
				}
			} catch (ex: any) {}
		}

		await postAll();

		expect(iterations).toStrictEqual(configs.length);
	});
});

describe('serial DELETE', () => {
	it('executes a DELETE request serially', async () => {
		const configs = [{ url: '/people/8' }, { url: '/people/9' }];

		let iterations = 0;

		async function deleteAll() {
			try {
				for await (const { status } of client.serialDelete(configs)) {
					iterations++;

					expect(status).toBe(200);
				}
			} catch (ex: any) {}
		}

		await deleteAll();

		expect(iterations).toStrictEqual(configs.length);
	});
});

describe('error processing with fail-fast behavior', () => {
	describe('serial PUT errors', () => {
		it('processes a PUT request error serially', async () => {
			const localClient = new HttpClient();

			localClient.setBaseUrl('null');
			const configs = [
				{
					url: 'null',
					data: { name: 'Egon Schiele' }
				},
				{
					url: 'null',
					data: { name: 'Ludwig Wittgenstein' }
				}
			];

			let iterations = 0;
			async function putAll() {
				try {
					for await (const _ of localClient.serialPut(configs));
				} catch (ex: any) {
					iterations++;
					expect(ex).toBeInstanceOf(Error);
				}
			}

			await putAll();

			expect(iterations).toBe(1);
		});
	});

	describe('serial POST errors', () => {
		it('processes a POST request error serially', async () => {
			const localClient = new HttpClient();

			localClient.setBaseUrl('null');
			const configs = [
				{
					url: 'null',
					data: { name: 'Terry Riley', id: 8 }
				},
				{
					url: 'null',
					data: { name: 'Sion Sono', id: 9 }
				}
			];

			let iterations = 0;

			async function postAll() {
				try {
					for await (const _ of localClient.serialPost(configs));
				} catch (ex: any) {
					iterations++;
					expect(ex).toBeInstanceOf(Error);
				}
			}

			await postAll();

			expect(iterations).toBe(1);
		});
	});

	describe('serial DELETE errors', () => {
		it('processes a DELETE request error serially', async () => {
			const localClient = new HttpClient();

			localClient.setBaseUrl('null');
			const configs = [{ url: 'null' }, { url: 'null' }];

			let iterations = 0;

			async function deleteAll() {
				try {
					for await (const _ of localClient.serialDelete(configs));
				} catch (ex: any) {
					iterations++;
					expect(ex).toBeInstanceOf(Error);
				}
			}

			await deleteAll();

			expect(iterations).toBe(1);
		});
	});
});

describe('error processing via continuations', () => {
	it('should resolve errors lazily when using continuation passing style', async () => {
		const localClient = new HttpClient();

		const urls = [{ url: 'null' }, { url: 'null' }];

		let iterations = 0;

		async function fetchAll() {
			for await (const _ of localClient.serialGet(urls, (rs) => {
				expect(rs.constructor.name).toBe(Error().constructor.name);
				iterations++;
			}));
		}

		await fetchAll();

		expect(iterations).toBe(urls.length);
	});
});
