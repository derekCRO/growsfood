import {List} from 'immutable';

export function getZoomXYZ(zoomFIPS) {
  if(!zoomFIPS) { return null; }
  // TODO: once have UI, find out boundary coordinates of path for FIPS
  return List([1, 2, 3]);
}
