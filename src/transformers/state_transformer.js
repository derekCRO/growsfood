import R from 'ramda';
import {TEMP_DIR, DATA_DIR} from '../constants';
import {arrayToKeyedObject} from './shared_transformer';

export const STATES_FILE = TEMP_DIR  + 'state_names.json';

export function load() {
  return JSON.parse('{ "states": ' + fs.readFileSync(STATES_FILE, 'utf8') + '}')["states"]
}

export function translate(states) {
  states.forEach(s => translateItem(s));
}

export function translateItem(state) {
  if(!state) { return {} };

  return {
    // convert fips into a string to preserve leading 0
    // add 000s for long code
    key: '' + state.state_fips + "000",
    shortName: state.state_abbreviation,
    longName: state.state_name
  }
}

export function save(output) {
  return output;
}

export function transform() {
  R.pipe(
    load,
    translate
  );
}
