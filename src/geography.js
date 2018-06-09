import {Map, List, toJS} from 'immutable';
import {INITIAL_STATE}   from './constants'
import topojson          from 'topojson';
import {normalizeFIPS}   from './fips';
import d3                from 'd3';

export const topoJSON       = require('../data/geo/us-geography.topo.json');
export const landTopoJSON   = topojson.feature(topoJSON, topoJSON.objects.land);
export const countyTopoJSON = topojson.feature(topoJSON, topoJSON.objects.counties);
export const countyTopoMesh = topojson.mesh(topoJSON, topoJSON.objects.counties, function(a, b) { return a.id !== b.id; });
export const stateTopoJSON  = topojson.feature(topoJSON, topoJSON.objects.states);
export const stateTopoMesh  = topojson.mesh(topoJSON, topoJSON.objects.states, function(a, b) { return a.id !== b.id; });

export const projection = d3.geo.albersUsa();
export const d3path     = d3.geo.path().projection(projection);

export const stateTopoJSONByFIPS = stateTopoJSON.features
                                        .map(state => ({fips: normalizeFIPS(state.id), topoJSON: state}))
                                        .reduce(function(accum, curr) {
                                            accum[curr.fips] = curr.topoJSON;
                                            return accum
                                        }, {})
                                    ;

export function getTopoJSONFromFIPS(fips) {
  if(!fips) { return null; }
  var
    fipsString = normalizeFIPS(fips),
    stateFIPS  = stateTopoJSONByFIPS[fipsString]
  ;
  return (stateFIPS ? stateFIPS : null);
}
