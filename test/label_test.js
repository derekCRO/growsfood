import {expect} from 'chai';
import {Map, List, fromJS} from 'immutable';

import {INITIAL_STATE, DEFAULT_LABEL} from '../src/constants';
import {select, product} from '../src/core';
import {getLabel, getProductLabel, getQueryLabel, getQueryUnits} from '../src/label';
import {productKeys} from '../src/products';

describe('label', () => {

	describe('defaults', () => {

    it('should have blank label by default', () => {
      expect(getLabel(INITIAL_STATE)).to.eq('');
    });

    it('should return blank string if given no state', () => {
      expect(getLabel(null, '000000')).to.eq('');
    });

  });

  describe('when have a region', () => {

    it('should set a state-related label', () => {
      var
        stateFIPS = '41000',
        stateName = 'Oregon',
        newState  = select(INITIAL_STATE, stateFIPS)
      ;
      expect(getLabel(newState)).to.eq(stateName);
    });

    it('should set a county-related label', () => {
      var
        countyFIPS = '41029',
        countyName = 'Jackson County, OR',
        newState   = select(INITIAL_STATE, countyFIPS)
      ;
      expect(getLabel(newState)).to.eq(countyName);
    });

  });

  describe('when have a product', () => {

    it('should set the product name in the label', () => {
      var
        productKey  = 'corn_acres_area_harvested_silage',
        productName = 'Corn (Silage)',
        newState    = product(INITIAL_STATE, productKey)
      ;
      expect(getLabel(newState)).to.eq(`${productName} (acres)`);
    });

  });

  describe('when have both a product and a region', () => {

    it('should include both product and region', () => {
      var
        productKey  = 'corn_acres_area_harvested_silage',
        productName = 'Corn (Silage)',
        regionFIPS  = '41029',
        regionName  = 'Jackson County, OR',
        newState    = product(INITIAL_STATE, productKey),
        newState    = select(newState, regionFIPS)
      ;
      expect(getLabel(newState)).to.eq(`${productName} (acres) - ${regionName}`);
    });

  });

  describe('getQueryLabel', () => {

    it('should return blank if null value', () => {
      expect(getQueryLabel(null)).to.be.null;
    });

    it('should return blank if unknown value', () => {
      expect(getQueryLabel(null)).to.be.null;
    });

    it('should handle area harvested', () => {
      expect(getQueryLabel('barley_acres_area_harvested')).to.eq('Barley');
    });

    it('should handle keys with classes in parens', () => {
      expect(getQueryLabel('lettuce_(romaine)_acres_area_harvested')).to.eq('Lettuce (Romaine)');
    });

    it('should handle queries by head', () => {
      expect(getQueryLabel('hogs_head_sales')).to.eq('Hogs');
    });

    it('should handle "excl" queries', () => {
      expect(getQueryLabel('beans_(dry_edible_excl_lima)_acres_area_harvested')).to.eq('Beans (Dry Edible Excl Lima)');
    });

    it('should handle an area bearing query', () => {
      expect(getQueryLabel('coffee_acres_area_bearing')).to.eq('Coffee');
    });

    it('should handle seed', () => {
      expect(getQueryLabel('sweet_corn_acres_area_harvested_seed')).to.eq('Sweet Corn (Seed)');
    });

    it('should handle shelled', () => {
      expect(getQueryLabel('popcorn_acres_area_harvested_shelled')).to.eq('Popcorn (Shelled)');
    });

    it('should handle grain', () => {
      expect(getQueryLabel('corn_acres_area_harvested_grain')).to.eq('Corn (Grain)');
    });

    it('should handle silage', () => {
      expect(getQueryLabel('corn_acres_area_harvested_silage')).to.eq('Corn (Silage)');
    });

  });

  describe('getQueryUnits', () => {

    it('should be blank if null value', () => {
      expect(getQueryUnits(null)).to.eq('');
    });

    it('should be blank if blank value', () => {
      expect(getQueryUnits('')).to.eq('');
    });

    it('should be blank if unknown value', () => {
      expect(getQueryUnits('asdfasdf')).to.eq('');
    });

    it('should return acres for crops', () => {
      expect(getQueryUnits('avocados_acres_area_bearing')).to.eq('acres');
    });

    it('should return head for livestock', () => {
      expect(getQueryUnits('hogs_head_sales')).to.eq('head');
    });

    it('should return units for something with util as well', () => {
      expect(getQueryUnits('corn_acres_area_harvested_silage')).to.eq('acres');
    });

  });

});
