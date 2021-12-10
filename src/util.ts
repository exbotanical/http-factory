import {
	isFunction,
	isObject,
	isString,
	isBoolean,
	contract
} from 'heuristics';

export const mustBeBool = contract(isBoolean, 'Must be Boolean');
export const mustBeFn = contract(isFunction, 'Must be function');
export const mustBeObj = contract(isObject, 'Must be object');
export const mustBeStr = contract(isString, 'Must be string');

export const identity = <T>(_: T): T => _;
