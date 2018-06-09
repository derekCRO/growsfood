import {Map, List, fromJS} from 'immutable';
import {ACTIONS} from './constants';

export function setProduct(product) {
  return {
    type:    ACTIONS.setProduct,
    product: product
  }
}

export function setRegion(fips) {
  return {
    type: ACTIONS.setRegion,
    fips: fips
  }
}

