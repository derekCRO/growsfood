import {Map, List, fromJS} from 'immutable';
import {isFipsNational, isFipsState, isFipsCounty} from './fips';

export function getDataFilterBySelectedFIPS(data, selectedFIPS) {
  var
    // if we're highlighting a state/county
    zoomedIn       = isFipsState(selectedFIPS) || isFipsCounty(selectedFIPS),
    // filter data by counties in that state
    filterFunction = zoomedIn ? dataFilterCounties : dataFilterStates
  ;
  // don't run the data through, just return the function
  return filterFunction;
}

export function dataFilterNational(data) {
  return dataFilterByFIPS(data, isFipsNational);
};

export function dataFilterStates(data) {
  return dataFilterByFIPS(data, isFipsState);
};

export function dataFilterCounties(data) {
  return dataFilterByFIPS(data, isFipsCounty);
};

export function dataFilterByFIPS(data, filterFunction) {
  if(!data || Object.keys(data).length == 0) { return {}; }

  return Object.keys(data)
        .map(k => ({fips: k, value: data[k]}))
        .filter(kv => filterFunction(kv.fips))
        .reduce(function(result, item) {
          result[item.fips] = item.value;
          return result;
        }, {})
}
