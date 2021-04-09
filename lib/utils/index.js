import {
  isFunction,
  isObject,
  isString,
  isBoolean,
  contract
} from 'js-heuristics';

const mustBeBool = contract(isBoolean, 'Must be Boolean');
const mustBeFn = contract(isFunction, 'Must be function');
const mustBeObj = contract(isObject, 'Must be object');
const mustBeStr = contract(isString, 'Must be string');

const identity = _ => _;

export {
  mustBeBool,
  mustBeFn,
  mustBeObj,
  mustBeStr,
  identity
};
