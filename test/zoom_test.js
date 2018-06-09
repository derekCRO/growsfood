import {expect} from 'chai';
import {Map, List, fromJS} from 'immutable';
import {getZoomXYZ} from '../src/zoom'

describe('zoom', () => {

  const stateZoomXYZ = List([1, 2, 3]);

  describe('getZoomXYZ', () => {

    it('should return null if given nothing', () => {
      expect(getZoomXYZ(null)).to.be.null;
    });

  });

});
