import {expect} from 'chai';
import {Map, List, fromJS} from 'immutable';

import {filterProducts, productFilter, filterOptions, filterOption, filenameFromOptions, filterOptionValueForFilename, filenamePartFromOptionValue, getRollupKey, getCleanKeys, getIntFromCommaString, getCleanJSON} from '../src/product_helper';

describe('product helper', () => {

  describe('filterProducts', () => {

    var
      desirable   = ['ASPARAGUS', 'EGGPLANT', 'SPINACH'],
      undesirable = ['RENT', 'INTEREST', 'FARM LOANS'],
      combined    = desirable.concat(undesirable)
    ;

    it('should return a blank array if null', () => {
      expect(filterProducts(null)).to.eql([]);
    });

    it('should return a blank array if blank array', () => {
      expect(filterProducts([])).to.eql([]);
    });

    it('should return the same object if not an array', () => {
      expect(filterProducts({test:'value'})).to.eql({test:'value'});
    });

    it('should return the same array if no undesirable words', () => {
      expect(filterProducts(desirable)).to.eql(desirable);
    });

    it('should return a filtered array if undesirable words', () => {
      expect(filterProducts(combined)).to.eql(desirable);
    });

    it('should return a blank array if all undesirable words', () => {
      expect(filterProducts(undesirable)).to.eql([]);
    });

  });

  describe('productFilter', () => {

    it('should keep desirable words', () => {
      expect(productFilter("SQUASH")).to.be.true;
    });

    it('should ignore undesirable words', () => {
      expect(productFilter("PIGEONS")).to.be.false;
    });

  });

  describe('filterOptions', () => {

    var
      desirable = ["AREA","AREA BEARING","AREA HARVESTED","SALES"]
    ;

    describe('known option key', () => {

      var
        optionKey   = 'statisticcat_desc',
        undesirable = ["SALES FOR SLAUGHTER","TAPS","TREATED","WATER RECEIVED","WORKERS"],
        combined    = desirable.concat(undesirable)
      ;

      it('should return a blank array if null', () => {
        expect(filterOptions(optionKey, null)).to.eql([]);
      });

      it('should return a blank array if blank array', () => {
        expect(filterOptions(optionKey, [])).to.eql([]);
      });

      it('should return the same object if not an array', () => {
        expect(filterOptions(optionKey, {test:'value'})).to.eql({test:'value'});
      });

      it('should return the same array if no undesirable words', () => {
        expect(filterOptions(optionKey, desirable)).to.eql(desirable);
      });

      it('should return a filtered array if undesirable words', () => {
        expect(filterOptions(optionKey, combined)).to.eql(desirable);
      });

      it('should return a blank array if all undesirable words', () => {
        expect(filterOptions(optionKey, undesirable)).to.eql([]);
      });

    });

    describe('unknown option key', () => {

      it('should return the same array without filtering', () => {
        expect(filterOptions('fake_option_key', desirable)).to.eql(desirable);
      });

      it('should return the same array if null', () => {
        expect(filterOptions(null, desirable)).to.eql(desirable);
      });

    });

  });

  describe('filterOption', () => {

    describe('statisticcat_desc', () => {

      var
        optionKey = 'statisticcat_desc'
      ;

      it('should keep desirable options', () => {
        expect(filterOption(optionKey, "AREA BEARING")).to.be.true;
      });

      it('should ignore undesirable options', () => {
        expect(filterOption(optionKey, "WATER RECEIVED")).to.be.false;
      });

    });

    describe('unknown option key', () => {

      it('should return true so as not to filter', () => {
        expect(filterOption('fake_option_key', "AREA BEARING")).to.be.true;
      });

      it('should return true if null', () => {
        expect(filterOption(null, "AREA BEARING")).to.be.true;
      });

    });

  });

  describe('filenameFromOptions', () => {

    var
      options = [ { "option": "commodity_desc", "value": "LETTUCE" }, { "option": "class_desc", "value": "ROMAINE" }, { "option": "unit_desc", "value": "ACRES" }, { "option": "statisticcat_desc", "value": "AREA HARVESTED" }, { "option": "util_practice_desc", "value": "ALL UTILIZATION PRACTICES" }, { "option": "prodn_practice_desc", "value": "ALL PRODUCTION PRACTICES" }, { "option": "domain_desc", "value": "TOTAL" }, { "option": "year", "value": "2012" }, { "option": "source_desc", "value": "CENSUS" }, { "option": "agg_level_desc", "value": "NATIONAL" } ],
      filename = filenameFromOptions(options)
    ;

    it('should omit _all_* values from filename', () => {
      expect(filename).to.not.contain('all');
    });

    it('should omit _total_ values from filename', () => {
      expect(filename).to.not.contain('total');
    });

    it('should omit _census_ from filename', () => {
      expect(filename).to.not.contain('census');
    });

    it('should omit _2012_ from filename', () => {
      expect(filename).to.not.contain('2012');
    });

    describe('product with specific class', () => {

      it('should put parenthesis around class', () => {
        expect(filename).to.contain('(');
        expect(filename).to.contain(')');
      });

      it('should have the class in the filename', () => {
        expect(filename).to.contain('romaine');
      });

    });

  });

  describe('filenamePartFromOptionValue', () => {

    it('should return just the value if regular option', () => {
      expect(filenamePartFromOptionValue({'option': 'unit_desc', 'value': 'ACRES'})).to.eq('acres');
    });

    it('should return class name wrapped in parenthesis', () => {
      expect(filenamePartFromOptionValue({'option': 'class_desc', 'value': 'ROMAINE'})).to.eq('(romaine)');
    });

  });

  describe('filterOptionValueForFilename', () => {

    it('should omit _all_* values from filename', () => {
      expect(filterOptionValueForFilename({'option': 'class_desc', 'value': "ALL CLASSES"})).to.be.false;
    });

    it('should omit _total_ values from filename', () => {
      expect(filterOptionValueForFilename({'option': 'domain_desc', 'value': "TOTAL"})).to.be.false;
    });

    it('should omit _census_ from filename', () => {
      expect(filterOptionValueForFilename({'option': 'source_desc', 'value': "CENSUS"})).to.be.false;
    });

    it('should omit _2012_ from filename', () => {
      expect(filterOptionValueForFilename({'option': 'year', 'value': "2012"})).to.be.false;
    });

    it('should keep good words', () => {
      expect(filterOptionValueForFilename({'option': 'commodity_desc', 'value': "APPLES"})).to.be.true;
    });

  });

  describe('getRollupKey', () => {

    it('should return null if null', () => {
      expect(getRollupKey(null)).to.be.null;
    });

    it('should chop of county', () => {
      expect(getRollupKey('onions_dry_acres_area_harvested_county')).to.eq('onions_dry_acres_area_harvested');
    });

    it('should chop off national', () => {
      expect(getRollupKey('onions_dry_acres_area_harvested_national')).to.eq('onions_dry_acres_area_harvested');
    });

    it('should chop off state', () => {
      expect(getRollupKey('onions_dry_acres_area_harvested_state')).to.eq('onions_dry_acres_area_harvested');
    });

  });

  describe('getCleanKeys', () => {

    var
      testInput = {test:'value', one:'two', ignore:{}},
      testOuput = getCleanKeys(testInput)
    ;

    it('should return blank array if null', () => {
      expect(getCleanKeys(null)).to.eql([]);
    });

    it('should not contain ignore key', () => {
      expect(testOuput).to.not.contain('ignore');
    });

    it('should return what is expected', () => {
      expect(testOuput).to.contain('test');
      expect(testOuput).to.contain('one');
    });

  });

  describe('getIntFromCommaString', () => {

    it('should return null for null', () => {
      expect(getIntFromCommaString(null)).to.be.null;
    });

    it('should handle being given an int', () => {
      expect(getIntFromCommaString(999)).to.eq(999);
    });

    it('should handle being given a string without commas', () => {
      expect(getIntFromCommaString('999')).to.eq(999);
    });

    it('should handle a string with commas', () => {
      expect(getIntFromCommaString('9,999')).to.eq(9999);
    });

    it('should handle a string with multiple commas', () => {
      expect(getIntFromCommaString('1,234,567,890')).to.eq(1234567890);
    });

  });

  describe('getCleanJSON', () => {

    var
      dirtyJSON   = require('./fixtures/oranges.json'),
      prodName    = 'oranges',
      props       = { slug: prodName },
      result      = getCleanJSON(dirtyJSON, props),
      product     = result[prodName],
      resultKeys  = Object.keys(result),
      productKeys = Object.keys(product)
    ;

    it('should have product as outermost key', () => {
      expect(resultKeys).to.have.length(1);
      expect(resultKeys).to.contain(prodName);
    });

    it('should have keys for each type', () => {
      expect(productKeys).to.have.length(3);
      expect(productKeys).to.contain('oranges_acres_area_bearing');
      expect(productKeys).to.contain('oranges_valencia_acres_area_bearing');
      expect(productKeys).to.contain('oranges_mid_and_navel_acres_area_bearing');
    });

    it("should have fips key for each type's stats", () => {
      productKeys.forEach(function(key) {
        expect(product[key]).to.include.keys('fips');
      });
    });

    it("should have fips set for each type's stats", () => {
      productKeys.forEach(function(key) {
        expect(product[key]['fips']).to.be.ok;
      });
    });

    it("should have fips values for each type's stats", () => {
      productKeys.forEach(function(key) {
        expect(Object.keys(product[key]['fips'])).to.have.length.above(0);
      });
    });

    it('should have stats for each type', () => {
      productKeys.forEach(function(key) {
        expect(product[key]).to.include.keys('stats');
      });
    });

    it("should have units for each type's stats", () => {
      productKeys.forEach(function(key) {
        expect(product[key]['stats']).to.include.keys('units');
      });
    });

    it("should have an actual value for units for each type's stats", () => {
      productKeys.forEach(function(key) {
        expect(product[key]['stats']['units']).to.be.ok;
      });
    });

    it("should have totals for each type's stats", () => {
      productKeys.forEach(function(key) {
        expect(product[key]['stats']).to.include.keys('totals');
      });
    });

    it("should have regions for each type's stats's totals", () => {
      productKeys.forEach(function(key) {
        expect(product[key]['stats']['totals']).to.include.keys('national');
        expect(product[key]['stats']['totals']).to.include.keys('state');
        expect(product[key]['stats']['totals']).to.include.keys('county');
      });
    });

    it("should have numbers greater than 0 for national totals", () => {
      productKeys.forEach(function(key) {
        expect(product[key]['stats']['totals']['national']).to.be.above(0);
      });
    });

    it("should have numbers greater than 0 for state totals", () => {
      productKeys.forEach(function(key) {
        expect(product[key]['stats']['totals']['state']).to.be.above(0);
      });
    });

    it("should have numbers greater than 0 for county totals", () => {
      productKeys.forEach(function(key) {
        expect(product[key]['stats']['totals']['county']).to.be.above(0);
      });
    });

  });

});
