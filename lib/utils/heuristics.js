module.exports = [
	'Object',
	'Function',
	'String',
  'Boolean'
].reduce((obj, name) => {
	obj['is' + name] = _ => toString.call(_) == '[object ' + name + ']';
	return obj;
}, {});
