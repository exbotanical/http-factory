const { isBoolean, isFunction, isObject, isString } = require('./heuristics');

module.exports = {
  mustBeBool: contract(isBoolean, 'Must be Boolean'),
  mustBeFn: contract(isFunction, 'Must be function'),
  mustBeObj: contract(isObject, 'Must be object'),
  mustBeStr: contract(isString, 'Must be string')
};

function contract (predicate, message) {
  return function (test) {
    if (predicate(test)) return true;
    throw new TypeError(message);
  };
}