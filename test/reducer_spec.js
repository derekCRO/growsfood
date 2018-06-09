import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer';
import {INITIAL_STATE, ACTIONS} from '../src/constants';

describe('reducer', () => {

  it('has an initial state', () => {
    const nextState = reducer(null, null);
    expect(nextState).to.equal(INITIAL_STATE);
  });

  describe('setRegion', () => {

    const countyFIPS   = '41029';

    it('handles action at basic level', () => {
      const action    = {type: ACTIONS.setRegion, fips: countyFIPS};
      const nextState = reducer(INITIAL_STATE, action);

      // simplest thing to make this pass is checking 'selected'
      // checking other attributes of state will make this too brittle
      expect(nextState.get('selected')).to.equal(countyFIPS);
    });

  });

  describe('setProduct', () => {

    const productKey  = 'spinach';

    it('sets product field', () => {
      const action    = {type: ACTIONS.setProduct, product: productKey};
      const nextState = reducer(INITIAL_STATE, action);

      // simplest thing to make this pass is checking 'selected'
      // checking other attributes of state will make this too brittle
      expect(nextState.get('product')).to.equal(productKey);
    });

  });

});
