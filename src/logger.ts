/* eslint-disable no-console */
import type { IRequestTransformer, IResponseTransformer } from './types';

export const logRequest: IRequestTransformer = (
	data: Record<string, any>,
	headers
) => {
	const printf = 'color: #4CAF50; font-weight: bold';

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (data && Object.keys(data).length > 0) {
		console.info('%c REQUEST: DATA ===> ', printf, { data });
	}

	console.info('%c REQUEST: HEADERS ===> ', printf, { headers });

	return data;
};

export const logResponse: IResponseTransformer = (data) => {
	const printf = 'color: #4CAF50; font-weight: bold';

	console.info('%c RESPONSE: DATA ===> ', printf, data);

	return data;
};
