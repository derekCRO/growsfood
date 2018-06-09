import R from 'ramda';
import {TEMP_DIR, DATA_DIR} from '../constants';
import {arrayToKeyedObject} from './shared_transformer';

export const COUNTY_FILE = TEMP_DIR  + 'county_names.json';

export function load() {
  JSON.parse('{ "counties": ' + fs.readFileSync(COUNTY_FILE, 'utf8') + '}')["counties"]
}

export function convert(csv) {
  var
    csvConverter = new Converter({
      toArrayString: true,
      constructResult: true,
      headers: [
        'state_abbreviation',
        'state_fips_short',
        'county_fips_short',
        'county_name',
        'county_fips_class_code'
      ]
    })
  ;

  csvConverter.fromString(csv, function(err, jsonObj) {
    if(err) {
      console.log('error converting');
      console.log(err);
    }
    console.log(jsonObj);
  })
}

export function translate(counties) {
  counties.forEach(s => translateItem(s));
}

export function translateItem(county) {
  if(!county) { return {} };

  return {
    key: county.state_fips_short + '' + county.county_fips_short,
    shortName: county.county_name.replace(' County', ''),
    longName: county.county_name + ', ' + county.state_abbreviation
  }
}

export function save(output) {
  return output;
}

export function transform() {
  R.pipe(
    load,
    transform,
    save
  );
}
