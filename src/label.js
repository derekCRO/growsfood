import {Map, List, fromJS} from 'immutable';
import {toTitleCase} from 'titlecase';

import {normalizeFIPS, FIPS_NATIONAL} from './fips';
import {productMeta, getDataForQuery} from './products';

export const labelJSON = require('../data/meta/geo_labels.json');

export function getLabel(state) {
  if(!state) { return ''; }

  var
    labels       = labelJSON,
    fips         = normalizeFIPS(state.get('selected')),
    product      = state.get('product'),
    regionLabel  = getRegionLabel(fips),
    productLabel = getQueryLabel(product),
    productUnits = getQueryUnits(product),
    label        = [];
  ;

  if(productLabel) { label.push(`${productLabel} (${productUnits})`); }
  if(regionLabel)  { label.push(regionLabel); }

  return label.join(' - ');
}

export function getRegionLabel(fips) {
  if(!fips || fips == FIPS_NATIONAL) { return null; }
  return labelJSON[fips]['long'];
}

export function getProductLabel(productKey) {
  if(!productKey) { return null; }

  var
    product = productMeta[productKey],
    label   = product ? product.name : '';
  ;

  return label;
}

export function getQueryLabel(query) {
  if(!query) { return null; }

  var
    product = query.split(/_(acres|head)/gi)[0].replace(/_/gi, ' '),
    util    = query.split(/_(grain|silage|seed|shelled|oil)/gi)[1],
    product = util ? `${product} (${util})` : product
  ;

  return toTitleCase(product);
}

export function getQueryUnits(query) {
  if(!query || query.length == 0) { return ''; }
  var
    product = getDataForQuery(query)
  ;
  if(product && product.stats && product.stats.units) {
    return product.stats.units.toLowerCase();
  } else {
    return '';
  }
}
