import {TEMP_DIR, DATA_DIR} from '../constants';
import R from 'ramda';
import {transform as stateTransform} from './state_transformer';
import {transform as countyTransform} from './county_transformer';

export const LABELS_FILE = DATA_DIR + 'labels.json';

export function load() {
  return {
    states: stateTransform(),
    counties: countyTransform()
  }
}

export function transform(input) {
  return R.merge(
    input.states,
    input.counties
  )
}

export function save(output) {
  fs.writeFile(LABELS_FILE, JSON.stringify(output), 'utf-8', function(err) {
    if (err) throw err;
  });
}

export function exec() {
  K.pipe(
    load,
    transform,
    save
  );
}
