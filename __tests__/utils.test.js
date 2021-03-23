import {
  mustBeBool,
  mustBeFn,
  mustBeObj,
  mustBeStr
} from '../lib/utils';

const str = '',
  fn = () => ({}),
  obj = {},
  bool = true;


describe('Evaluation of base utilities', () => {
  describe('assess contract violations', () => {
    it('throws an error when boolean contract is violated', () => {
      expect(() => mustBeBool(str)).toThrow();
    });
  
    it('throws an error when function contract is violated', () => {
      expect(() => mustBeFn(obj)).toThrow();
    });
  
    it('throws an error when object contract is violated', () => {
      expect(() => mustBeObj(bool)).toThrow();
    });
  
    it('throws an error when string contract is violated', () => {
      expect(() => mustBeStr(bool)).toThrow();
    });
  });

  describe('assess contract fulfillment', () => {
    it('returns true when boolean contract is violated', () => {
      expect(mustBeBool(bool)).toBe(true);
    });
  
    it('returns true when function contract is violated', () => {
      expect(mustBeFn(fn)).toBe(true);
    });
  
    it('returns true when object contract is violated', () => {
      expect(mustBeObj(obj)).toBe(true);
    });
  
    it('returns true when string contract is violated', () => {
      expect(mustBeStr(str)).toBe(true);
    });
  });
});

