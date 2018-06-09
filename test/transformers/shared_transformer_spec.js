import {expect} from 'chai';

import {arrayToKeyedObject} from '../../src/transformers/shared_transformer'

describe('shared transformer', () => {

  describe('arrayToKeyedObject', () => {

    it('should return blank object when null', () => {
      expect(arrayToKeyedObject(null)).to.eql({});
    });

    it('should return blank object when empty array', () => {
      expect(arrayToKeyedObject([])).to.eql({});
    });

    it('should return the same object if it was not an array', () => {
      var testObject = {'test':'value'};
      expect(arrayToKeyedObject(testObject)).to.eql(testObject);
    });

    it('should use the key property to set the object key', () => {
      var
        testKey    = 'test-key',
        testObject = [{
          key:  testKey,
          test: 'value'
        }],
        keyedObject = arrayToKeyedObject(testObject),
        objectKeys  = Object.keys(keyedObject)
      ;

      expect(objectKeys).to.contain(testKey);
    });

    it('should delete the key property from resultant object', () => {
      var
        testKey    = 'test-key',
        testObject = [{
          key:  testKey,
          test: 'value'
        }],
        keyedObject  = arrayToKeyedObject(testObject),
        resultObject = keyedObject[testKey],
        resultKeys   = Object.keys(resultObject)
      ;

      expect(resultKeys).to.not.contain('key');
    });

    it('should handle multiple elements', () => {
      var
        obj1     = { 'key': 'key1', 'name': 'name1' },
        obj2     = { 'key': 'key2', 'name': 'name2' },
        obj3     = { 'key': 'key3', 'name': 'name3' },
        arr      = [obj1, obj2, obj3],
        result   = arrayToKeyedObject(arr),
        expected = {
          'key1': { 'name': 'name1' },
          'key2': { 'name': 'name2' },
          'key3': { 'name': 'name3' }
        }
      ;

      expect(result).to.eql(expected);
    });

  });

});
