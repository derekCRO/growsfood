import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {INITIAL_STATE, ACTIONS} from '../src/constants';
import makeStore from '../src/store';

describe('store', () => {

  const countyFIPS = '41029';

  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore();
    expect(store.getState()).to.equal(INITIAL_STATE);

    store.dispatch({
      type: ACTIONS.setRegion,
      fips: countyFIPS
    });

    expect(store.getState().get('selected')).to.equal(countyFIPS);
  });

});
