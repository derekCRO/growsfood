var
  slug                   = require('slug'),
  deepExtend             = require('deep-extend'),
  fips                   = require('./fips.js'),
  getFipsFromStateCounty = fips.getFipsFromStateCounty,
  getFipsType            = fips.getFipsType
;



function filterProducts(arr) {
  // return blank object if null or empty array
  if(!arr || arr.length == 0) { return [] };

  // return same object if not an array
  if(!Array.isArray(arr)) { return arr; }

  return arr.filter(productFilter);
}

function productFilter(product) {
  var
    regex  = new RegExp('OTHER|TOTALS|REPAIRS|INTERNET|AREA|HYBRIDS|TAXES|OPERATIONS|LABOR|FARM|LAND|SPAWN|FACILITY|SOD|LOANS|ENERGY|INTEREST|PRINCIPAL|DEPRECIATION|OPERATORS|SERVICES|PROGRAMS|PRACTICES|RENT|FUELS|ORNAMENTAL FISH|TREES & SHORT|FEED|HAYLAGE|PIGEONS|TEMPLES|TRANSPLANTS|HONEY|EQUINE', 'gi'),
    ignore = regex.test(product),
    keep   = (ignore == false)
  ;
  return keep;
}

function filterOptions(option, arr) {
  // return blank object if null or empty array
  if(!arr || arr.length == 0) { return [] };

  // return same object if not an array
  if(!Array.isArray(arr)) { return arr; }

  return arr.filter(function(value) {
    return filterOption(option, value);
  });
}

function filterOption(option, value) {
  var
    allOptions = {
      "statisticcat_desc":   ["AREA","AREA BEARING","AREA BEARING & NON-BEARING","AREA GROWN","AREA HARVESTED","AREA IN PRODUCTION","AREA NON-BEARING","AREA NOT HARVESTED","AREA OPERATED","EXPENSE","GAIN","HATCHED","LOSS","NET INCOME","OPERATIONS","OPERATORS","PRODUCTION","RECEIPTS","REPAYMENTS","SALES","SALES & DISTRIBUTION","SALES FOR SLAUGHTER","TAPS","TREATED","WATER RECEIVED","WORKERS","YEARS ON ANY OPERATION, AVG","YEARS ON PRESENT OPERATION, AVG"],
      "domain_desc":         ["FERTILIZER","SALES OF HOGS","AREA OPERATED","CHEMICAL, HERBICIDE","CHEMICAL, INSECTICIDE","CHEMICAL, OTHER","OPERATORS","SALES OF CATTLE ON FEED","AREA BEARING & NON-BEARING","CHEMICAL, FUNGICIDE","OPERATORS, PRINCIPAL","ORGANIC STATUS AND SALES","SALES OF CALVES","SALES OF CATTLE GE 500 LBS","SALES OF CATTLE, INCL CALVES","AREA HARVESTED, FRESH MARKET & PROCESSING","FARM SALES","IRRIGATION STATUS","NAICS CLASSIFICATION","TENURE AND OPERATORS, PRINCIPAL","TOTAL","AREA HARVESTED","ECONOMIC CLASS","LABOR","ORGANIC STATUS","SALES","TENURE"],
      "prodn_practice_desc": ["ACCESS","ACCESS, VIA BROADBAND OVER POWER LINES","ACCESS, VIA CABLE","ACCESS, VIA DIALUP","ACCESS, VIA DSL","ACCESS, VIA FIBER OPTIC","ACCESS, VIA MOBILE","ACCESS, VIA OTHER","ACCESS, VIA SATELLITE","ALL PRODUCTION PRACTICES","CROP INSURANCE","DAYS WORKED OFF OPERATION, 0 DAYS","DAYS WORKED OFF OPERATION, 1 TO 49 DAYS","DAYS WORKED OFF OPERATION, 100 TO 199 DAYS","DAYS WORKED OFF OPERATION, 50 TO 99 DAYS","DAYS WORKED OFF OPERATION, GE 1 DAYS","DAYS WORKED OFF OPERATION, GE 200 DAYS","IN THE OPEN","IN THE OPEN, IRRIGATED","IRRIGATED","ON FEED","ORGANIC","ORGANIC, TRANSITIONING","OWNED","OWNED, IN FARMS","PRIMARY OCCUPATION, (EXCL FARMING)","PRIMARY OCCUPATION, FARMING","PRODUCTION CONTRACT","PRODUCTION CONTRACT, ON FEED","RAISED OR SOLD","RENTED FROM OTHERS, IN FARMS","RESIDENCE, NOT ON OPERATION","RESIDENCE, ON OPERATION","ROTATIONAL OR MGMT INTENSIVE GRAZING","UNDER PROTECTION","VALUE-ADDED PRODUCTS","YEARS ON ANY OPERATION, 3 TO 4 YEARS","YEARS ON ANY OPERATION, 5 TO 9 YEARS","YEARS ON ANY OPERATION, GE 10 YEARS","YEARS ON ANY OPERATION, LT 3 YEARS","YEARS ON PRESENT OPERATION, 3 TO 4 YEARS","YEARS ON PRESENT OPERATION, 5 TO 9 YEARS","YEARS ON PRESENT OPERATION, GE 10 YEARS","YEARS ON PRESENT OPERATION, LT 3 YEARS"],
      "unit_desc":           ["$","$ / OPERATION","ACRES","ACRES / OPERATION","ACRES / OPERATION, MEDIAN","BALES","BU","CWT","DOZEN","GALLONS","HEAD","LB","NUMBER","OPERATIONS","OPERATORS","SQ FT","TONS","TONS, DRY BASIS","TREES","YEARS" ],
      "util_practice_desc":  ["ALL UTILIZATION PRACTICES","FRESH MARKET","GRAIN","LINT & SEED","OIL","ON FARM","PROCESSING","PROCESSING, PICKLES","RETAIL, COMMUNITY SUPPORTED AG","RETAIL, HUMAN CONSUMPTION","SEED","SHELLED","SILAGE","SUGAR","SYRUP","WHOLESALE, DIRECT TO RETAILER"]
    },
    optionsFilter = {
      "statisticcat_desc":   ["AREA","AREA BEARING","AREA HARVESTED","PRODUCTION","SALES"],
      "domain_desc":         ["TOTAL"],
      "prodn_practice_desc": ["ALL PRODUCTION PRACTICES","IN THE OPEN","UNDER PROTECTION","PRODUCTION CONTRACT"],
      "unit_desc":           ["ACRES","DOZEN","GALLONS","HEAD","NUMBER"],
      "util_practice_desc":  ["ALL UTILIZATION PRACTICES","GRAIN","SILAGE","SEED","SHELLED","OIL"]
    },
    filter = optionsFilter[option],
    keep  = !option || !filter || (filter.indexOf(value) > -1)
  ;

  return keep;
}

function filenameFromOptions(hashArray) {
  var
    filtered = hashArray.filter(filterOptionValueForFilename),
    filename = filtered.map(filenamePartFromOptionValue).join('_')
  ;
  return filename;
}

function filenamePartFromOptionValue(hash) {
  var
    option     = hash.option,
    value      = hash.value,
    value_slug = slug(value.toLowerCase(), '_')
  ;

  if(option == 'class_desc') {
    // return with parens around
    return `(${value_slug})`
  } else {
    return value_slug;
  }
}

function filterOptionValueForFilename(hash) {
  var
    option = hash.option,
    value  = hash.value,
    regex  = new RegExp('^(ALL|TOTAL|CENSUS|2012)', 'gi'),
    ignore = regex.test(value),
    keep   = (ignore == false)
  ;
  return keep;
}

function getCleanKeys(dirtyJSON) {
  if(!dirtyJSON) { return []; }

  // remove the 'ignore' before getting keys
  delete dirtyJSON['ignore'];
  return Object.keys(dirtyJSON)
}

function getRollupKey(key) {
  if(!key) { return null; }
  return key.replace(/_(national|state|county)/gi, '')
}

function getCleanJSON(json) {
  if(!json) { return {}; }

  if(json['data']) {
    // if we see 'data', that means we are at a level deep enough to roll up
    return rollupProductArray(json['data']);
  } else {
    // otherwise, recursively go through keys until we reach that deep level

    var
      // clean keys so we don't end up with the ignore: {} that might be sent down
      keys = getCleanKeys(json),

      // what we'll return at the very end
      output = {}
    ;

    // these are like key_one_national, key_two_state, etc.
    keys.forEach(function(key) {
      var
        // find a logical grouping for these so combine national, state, county
        group = getRollupKey(key),

        // store values from this current iteration that we'll merge later into global output
        iteration = {}
      ;
      // recursively call for each key and store for this iteration by group key
      iteration[group] = getCleanJSON(json[key])

      // merge iteration into absolute output that we'll return at the end
      output = deepExtend(output, iteration);
    });
  }

  return output;
}

function rollupProductArray(arr) {
  var
    // logical structure that we'll return back up to our parent that called us
    output = {
      stats: {
        units:  arr[0]['unit_desc'],
        totals: {}
      },
      fips: {}
    }
  ;

  // go through each item in my array and simplify attributes into { fips: value }
  arr.forEach(function(item) {
    var
      state_fips_code = item['state_fips_code'] || null,
      county_code     = item['county_code'] || null,
      fips            = getFipsFromStateCounty(state_fips_code, county_code),
      fipsType        = getFipsType(fips),
      value           = item['value'] || null,
      value_int       = getIntFromCommaString(value)
    ;

    // only record value if we've actually got a value (not (D) or (Z))
    if(value_int >= 0) {
      output['fips'][fips] = value_int;
      // like ruby ||= except much uglier  :(
      // necessary so that 0 values don't trounce actual values when deep merge later
      output.stats.totals[getFipsType(fips)] = output.stats.totals[getFipsType(fips)] ? output.stats.totals[getFipsType(fips)] + value_int : value_int;
    }
  });

  // returning logical structure from above, but now with actual data!
  return output;
}

function getIntFromCommaString(value) {
  if(!value) { return null; }
  var
    value_str   = '' + value,
    value_clean = value_str.replace(/,/g, ''),
    value_int   = parseInt(value_clean)
  ;
  return value_int;
}

// old skewl way of exporting
// wish I could use ES6 with gulp
// I'm sure there's a way ...

module.exports.filterProducts = filterProducts;
module.exports.productFilter  = productFilter;

module.exports.filterOptions = filterOptions;
module.exports.filterOption  = filterOption;

module.exports.filenameFromOptions = filenameFromOptions;
module.exports.filenamePartFromOptionValue = filenamePartFromOptionValue;
module.exports.filterOptionValueForFilename = filterOptionValueForFilename;

module.exports.getCleanJSON          = getCleanJSON;
module.exports.getRollupKey          = getRollupKey;
module.exports.getCleanKeys          = getCleanKeys;
module.exports.getIntFromCommaString = getIntFromCommaString;

module.exports.getCleanJSON = getCleanJSON;
