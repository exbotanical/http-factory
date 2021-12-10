export interface IBaseClientInstance {
	defaults: IDefaults;
	interceptors: {
		request: IInterceptorManager<IRequestConfig>;
		response: IInterceptorManager<any>;
	};

	<T = any>(config: IRequestConfig): Promise<T>;
	<T = any>(url: string, config?: IRequestConfig): Promise<T>;
}

export interface IDefaults<D = any> extends Omit<IRequestConfig<D>, 'headers'> {
	headers: IHeadersDefaults;
}

export interface IContinuation<N> {
	(normalized: N): any;
}

export type IRequestHeaders = Record<string, string>;

type IResponseHeaders = Record<string, string> & {
	'set-cookie'?: string[];
};

export interface IRequestTransformer {
	(data: any, headers?: IRequestHeaders): any;
}

export interface IResponseTransformer {
	(data: any, headers?: IResponseHeaders): any;
}

export interface IAdapter {
	(config: IRequestConfig): IPromise;
}

export interface IBasicCredentials {
	username: string;
	password: string;
}

interface IProxyConfig {
	host: string;
	port: number;
	auth?: {
		username: string;
		password: string;
	};
	protocol?: string;
}

type Method =
	| 'get'
	| 'GET'
	| 'delete'
	| 'DELETE'
	| 'head'
	| 'HEAD'
	| 'options'
	| 'OPTIONS'
	| 'post'
	| 'POST'
	| 'put'
	| 'PUT'
	| 'patch'
	| 'PATCH'
	| 'purge'
	| 'PURGE'
	| 'link'
	| 'LINK'
	| 'unlink'
	| 'UNLINK';

type ResponseType =
	| 'arraybuffer'
	| 'blob'
	| 'document'
	| 'json'
	| 'text'
	| 'stream';

interface TransitionalOptions {
	silentJSONParsing?: boolean;
	forcedJSONParsing?: boolean;
	clarifyTimeoutError?: boolean;
}

export interface IRequestConfig<D = any> {
	url?: string;
	method?: Method;
	baseURL?: string;
	transformRequest?: IRequestTransformer | IRequestTransformer[];
	transformResponse?: IResponseTransformer | IResponseTransformer[];
	headers?: IRequestHeaders;
	params?: any;
	paramsSerializer?: (params: any) => string;
	data?: D;
	timeout?: number;
	timeoutErrorMessage?: string;
	withCredentials?: boolean;
	adapter?: IAdapter;
	auth?: IBasicCredentials;
	responseType?: ResponseType;
	xsrfCookieName?: string;
	xsrfHeaderName?: string;
	onUploadProgress?: (progressEvent: any) => void;
	onDownloadProgress?: (progressEvent: any) => void;
	maxContentLength?: number;
	validateStatus?: ((status: number) => boolean) | null;
	maxBodyLength?: number;
	maxRedirects?: number;
	socketPath?: string | null;
	httpAgent?: any;
	httpsAgent?: any;
	proxy?: IProxyConfig | false;
	cancelToken?: CancelToken;
	decompress?: boolean;
	transitional?: TransitionalOptions;
	signal?: AbortSignal;
	insecureHTTPParser?: boolean;
}

interface IHeadersDefaults {
	common: IRequestHeaders;
	delete: IRequestHeaders;
	get: IRequestHeaders;
	head: IRequestHeaders;
	post: IRequestHeaders;
	put: IRequestHeaders;
	patch: IRequestHeaders;
	options?: IRequestHeaders;
	purge?: IRequestHeaders;
	link?: IRequestHeaders;
	unlink?: IRequestHeaders;
}

interface IDefaults<D = any> extends Omit<IRequestConfig<D>, 'headers'> {
	headers: IHeadersDefaults;
}

export interface IResponse<T = any, D = any> {
	data: T;
	status: number;
	statusText: string;
	headers: IResponseHeaders;
	config: IRequestConfig<D>;
	request?: any;
}

export interface IError<T = any, D = any> extends Error {
	config: IRequestConfig<D>;
	code?: string;
	request?: any;
	response?: IResponse<T, D>;
	isIError: boolean;
	toJSON: () => object;
}

interface IPromise<T = any> extends Promise<IResponse<T>> {}

interface CancelStatic {
	new (message?: string): Cancel;
}

interface Cancel {
	message: string;
}

interface Canceler {
	(message?: string): void;
}

interface CancelTokenStatic {
	new (executor: (cancel: Canceler) => void): CancelToken;
	source(): CancelTokenSource;
}

interface CancelToken {
	promise: Promise<Cancel>;
	reason?: Cancel;
	throwIfRequested(): void;
}

interface CancelTokenSource {
	token: CancelToken;
	cancel: Canceler;
}

interface IInterceptorManager<V> {
	use<T = V>(
		onFulfilled?: (value: V) => T | Promise<T>,
		onRejected?: (error: any) => any
	): number;
	eject(id: number): void;
}
