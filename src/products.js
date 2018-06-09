import {Map, List, toJS} from 'immutable';
import {INITIAL_STATE} from './constants'
import {filterProducts, productFilter} from './product_helper'
import {getQueryLabel} from './label';

export const productMeta    = require('../data/meta/product_meta.json');
export const productData    = require('../data/products.json').products;
export const productQueries = Object.keys(productData)
                                    .filter(filterProductQuery)
                                    .sort();
export const productOptions = productQueries
                                  .map(key => ({
                                    value: key,
                                    label: getQueryLabel(key)
                                  }));

export function filterProductQuery(query) {
  if(!query) { return false; }
  // ensure we don't include undesirable queries
  if(query.indexOf('contract') > -1) { return false; }
  // ensure that this query actually has values
  if(!getDataForQuery(query).fips) { return false; }
  if(Object.keys(getDataForQuery(query).fips).length <= 1) { return false; }
  // if made it this far, you win!
  return true;
}

export function getDataForQuery(query) {
  if(!query) { return []; }
  return productData[query] || [];
}
