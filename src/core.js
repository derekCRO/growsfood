import {Map, List, fromJS} from 'immutable';

import {getStateFIPS, normalizeFIPS} from '../src/fips';
import {getZoomXYZ} from '../src/zoom';
import {productMeta} from '../src/products';

export function select(state, fips) {
  var
    fips = normalizeFIPS(fips),
    detailLayers = (fips == '00000') ? state.get('detail').delete('counties') : state.get('detail').add('counties')
  ;
  return state
    .set('selected', fips)
    .set('detail',   detailLayers)
    .set('zoom',     getZoomXYZ(fips))
  ;
}

export function product(state, productKey) {
  return state
    .set('product', productKey)
  ;
};

