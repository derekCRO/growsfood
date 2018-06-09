
export function arrayToKeyedObject(arr) {
  var output = {};

  // return blank object if null or empty array
  if(!arr || arr.length == 0) { return output };

  // return same object if not an array
  if(!Array.isArray(arr)) { return arr; }

  for(var i = 0; i < arr.length; i++) {
    var
      item = arr[i],
      key  = item.key
    ;

    // remove key since not going to need to store that
    delete item.key;

    output[key] = item;
  }

  return output;
}

