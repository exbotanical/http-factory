/* eslint-disable @typescript-eslint/no-unsafe-argument,no-await-in-loop */
import axios from 'axios';

import { logRequest, logResponse } from './logger';
import { mustBeStr, mustBeFn, mustBeObj } from './util';

import type {
	IRequestConfig,
	IContinuation,
	IError,
	IRequestTransformer,
	IResponse,
	IResponseTransformer,
	IBaseClientInstance
} from './types';

/**
 * Factory for creating new Http clients.
 *
 * @public
 */
export class HttpClient {
	client: IBaseClientInstance;

	protected transformRequest;

	protected transformResponse;

	constructor(opts?: IRequestConfig) {
		if (opts) {
			mustBeObj(opts);
		}

		this.client = axios.create(opts);

		this.transformRequest = this.client.defaults.transformRequest;
		this.transformResponse = this.client.defaults.transformResponse;
	}

	/**
	 * Set a base URL for the instance
	 *
	 * @public
	 */
	setBaseUrl(url: string) {
		mustBeStr(url);
		this.client.defaults.baseURL = url;

		return this;
	}

	/**
	 * Transform outbound requests or inbound responses
	 *
	 * @public
	 */
	transforms({
		request = [],
		response = []
	}: {
		request?: IRequestTransformer | IRequestTransformer[];
		response?: IResponseTransformer | IResponseTransformer[];
	} = {}) {
		/* istanbul ignore next */
		if (
			Array.isArray(this.transformRequest) &&
			Array.isArray(this.transformResponse)
		) {
			this.transformRequest.concat(request);
			this.transformResponse.concat(response);
		}

		return this;
	}

	/**
	 * Intercept outbound requests or inbound responses, errors
	 *
	 * @public
	 */
	intercepts({
		request = (_) => _,
		response = (_) => _,
		error = (_) => _
	}: {
		request?: (config: IRequestConfig) => IRequestConfig;
		response?: (response: IResponse) => any;
		error?: (error: IError) => any;
	}) {
		mustBeFn(request);
		mustBeFn(response);
		mustBeFn(error);

		this.client.interceptors.request.use(request);

		this.client.interceptors.response.use(response, error);

		return this;
	}

	/**
	 * Log outbound requests or inbound responses
	 *
	 * @public
	 */
	logs({ request = true, response = true } = {}) {
		/* istanbul ignore next */
		if (
			Array.isArray(this.transformRequest) &&
			Array.isArray(this.transformResponse)
		) {
			if (request) {
				this.transformRequest = this.transformRequest.concat(logRequest);
			}

			if (response) {
				this.transformResponse = this.transformResponse.concat(logResponse);
			}
		}

		return this;
	}

	/**
	 * Send a GET request
	 *
	 * @public
	 */
	async get<R = any, D = any>(
		config?: IRequestConfig<D>,
		cb?: IContinuation<R>
	) {
		if (cb != null) {
			mustBeFn(cb);
		}

		return this.client<R>({
			method: 'get',
			...config
		})
			.then<R>(cb)
			.catch<R>(cb);
	}

	/**
	 * Send a POST request
	 *
	 * @public
	 */
	async post<R = any, D = any>(
		config?: IRequestConfig<D>,
		cb?: IContinuation<R>
	) {
		if (cb != null) {
			mustBeFn(cb);
		}

		return this.client<R>({
			method: 'post',
			...config
		})
			.then<R>(cb)
			.catch<R>(cb);
	}

	/**
	 * Send a PUT request
	 *
	 * @public
	 */
	async put<R = any, D = any>(
		config?: IRequestConfig<D>,
		cb?: IContinuation<R>
	) {
		if (cb != null) {
			mustBeFn(cb);
		}

		return this.client<R>({
			method: 'put',
			...config
		})
			.then<R>(cb)
			.catch<R>(cb);
	}

	/**
	 * Send a DELETE request
	 *
	 * @public
	 */
	async delete<R = any, D = any>(
		config?: IRequestConfig<D>,
		cb?: IContinuation<R>
	) {
		if (cb != null) {
			mustBeFn(cb);
		}

		return this.client<R>({
			method: 'delete',
			...config
		})
			.then<R>(cb)
			.catch<R>(cb);
	}

	/**
	 * Send a GET request that executes serially
	 *
	 * @public
	 */
	async *serialGet<R = any, D = any>(
		config: IRequestConfig<D>[],
		cb?: IContinuation<R>
	) {
		// throw error now in lieu of letting it propagate at underlying method
		if (cb != null) {
			mustBeFn(cb);
		}

		for (const conf of config) {
			try {
				const response = await this.get<R, D>(conf);

				if (cb) {
					yield cb(response);
				} else {
					yield response;
				}
			} catch (ex: any) {
				if (cb) {
					yield cb(ex);
				} else {
					yield new Promise((_, reject) => {
						reject(new Error(ex));
					});
				}
			}
		}
	}

	/**
	 * Send a POST request that executes serially
	 *
	 * @public
	 */
	async *serialPost<R = any, D = any>(
		config: IRequestConfig<D>[],
		cb?: IContinuation<R>
	) {
		if (cb != null) {
			mustBeFn(cb);
		}

		for (const conf of config) {
			try {
				const response = await this.post<R, D>(conf);

				if (cb) {
					yield cb(response);
				} else {
					yield response;
				}
			} catch (ex: any) {
				if (cb) {
					yield cb(ex);
				} else {
					yield new Promise((_, reject) => {
						reject(new Error(ex));
					});
				}
			}
		}
	}

	/**
	 * Send a PUT request that executes serially
	 *
	 * @public
	 */
	async *serialPut<R = any, D = any>(
		config: IRequestConfig<D>[],
		cb?: IContinuation<R>
	) {
		if (cb != null) {
			mustBeFn(cb);
		}

		for (const conf of config) {
			try {
				const response = await this.put<R, D>(conf);

				if (cb) {
					yield cb(response);
				} else {
					yield response;
				}
			} catch (ex: any) {
				if (cb) {
					yield cb(ex);
				} else {
					yield new Promise((_, reject) => {
						reject(new Error(ex));
					});
				}
			}
		}
	}

	/**
	 * Send a DELETE request that executes serially
	 *
	 * @public
	 */
	async *serialDelete<R = any, D = any>(
		config: IRequestConfig<D>[],
		cb?: IContinuation<R>
	) {
		if (cb != null) {
			mustBeFn(cb);
		}

		for (const conf of config) {
			try {
				const response = await this.delete<R, D>(conf);

				if (cb) {
					yield cb(response);
				} else {
					yield response;
				}
			} catch (ex: any) {
				if (cb) {
					yield cb(ex);
				} else {
					yield new Promise((_, reject) => {
						reject(new Error(ex));
					});
				}
			}
		}
	}
}
