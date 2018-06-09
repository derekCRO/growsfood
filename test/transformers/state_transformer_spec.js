import {expect} from 'chai';

import {REGION_KEYS} from '../../src/constants';
import {arrayToKeyedObject} from '../../src/transformers/shared_transformer'
import {translateItem} from '../../src/transformers/state_transformer'

describe('state transformer', () => {

  describe('translateItem', () => {

    var
      testState = {"state_fips":41,"state_abbreviation":"OR","state_name":"Oregon","state_ens":"01155107","fips":"41000","short":"OR","long":"Oregon"}
    ;

    it('should return blank object on null', () => {
      expect(translateItem(null)).to.eql({});
    });

    it('should return appropriate keys', () => {
      var
        resultObject = translateItem(testState),
        resultKeys   = Object.keys(resultObject)
      ;

      REGION_KEYS.forEach(k => expect(resultKeys).to.contain(k));
    });

    it('should translate intput into output', () => {
      var
        resultObject = translateItem(testState),
        expected = {
          key: "41000",
          longName: "Oregon",
          shortName: "OR"
        }
      ;

      expect(resultObject).to.eql(expected);
    });

  });

  describe('translate', () => {

    it('should handle an array of objects', () => {

    });

  });

});
