import typeChecks from './heuristics';

const { isBoolean, isFunction, isObject, isString } = typeChecks;

const mustBeBool = contract(isBoolean, 'Must be Boolean');
const mustBeFn = contract(isFunction, 'Must be function');
const mustBeObj = contract(isObject, 'Must be object');
const mustBeStr = contract(isString, 'Must be string');

export {
  mustBeBool,
  mustBeFn,
  mustBeObj,
  mustBeStr
};

function contract (predicate, message) {
  return function (test) {
    if (predicate(test)) return true;
    throw new TypeError(message);
  };
}
