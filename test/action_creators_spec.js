import {expect} from 'chai';
import {Map, List, fromJS} from 'immutable';
import {INITIAL_STATE, ACTIONS} from '../src/constants';
import {setRegion, setProduct} from '../src/action_creators';

describe('action creators', () => {

  describe('setRegion', () => {

    it('should fire action with FIPS', () => {
      var fips = '41029';
      expect(setRegion(fips)).to.eql({
        type: ACTIONS.setRegion,
        fips: fips
      });
    });

  });

  describe('setProduct', () => {

    it('should fire action with product', () => {
      var product = 'spinach';
      expect(setProduct(product)).to.eql({
        type: ACTIONS.setProduct,
        product: product
      });
    });

  });

});
