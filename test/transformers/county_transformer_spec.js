import {expect} from 'chai';

import {REGION_KEYS} from '../../src/constants';
import {arrayToKeyedObject} from '../../src/transformers/shared_transformer'
import {translateItem} from '../../src/transformers/county_transformer'

describe('county transformer', () => {

  describe('translateItem', () => {

    var
      testCounty = {"state_abbreviation":"OR","state_fips_short":41,"county_fips_short":"029","county_name":"Jackson County","county_fips_class_code":"H1","fips":"41029","short":"Jackson","long":"Jackson County, OR"}
    ;

    it('should return blank object on null', () => {
      expect(translateItem(null)).to.eql({});
    });

    it('should return appropriate keys', () => {
      var
        resultObject = translateItem(testCounty),
        resultKeys   = Object.keys(resultObject)
      ;

      REGION_KEYS.forEach(k => expect(resultKeys).to.contain(k));
    });

    it('should translate intput into output', () => {
      var
        resultObject = translateItem(testCounty),
        expected = {
          key: "41029",
          longName: "Jackson County, OR",
          shortName: "Jackson"
        }
      ;

      expect(resultObject).to.eql(expected);
    });

  });

});
