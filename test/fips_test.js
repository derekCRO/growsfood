import {expect} from 'chai';
import {Map, List, fromJS} from 'immutable';
import {getStateFIPS, normalizeFIPS, FIPS_NATIONAL, getFipsType, isFipsNational, isFipsState, isFipsCounty, getFipsFromStateCounty} from '../src/fips'

describe('fips', () => {

  const stateFIPS    = '41000';
  const countyFIPS   = '41029';
  const nationalFIPS = FIPS_NATIONAL;

  describe('getStateFIPS', () => {

    it('should return null if given nothing', () => {
      expect(getStateFIPS(null)).to.be.null;
    });

    it('should return null if given invalid FIPS', () => {
      expect(getStateFIPS(0)).to.be.null;
    });

    it('should return the same FIPS if it is a state', () => {
      expect(getStateFIPS(stateFIPS)).to.eq(stateFIPS);
    });

    it('should return the state FIPS if it is a county', () => {
      expect(getStateFIPS(countyFIPS)).to.eq(stateFIPS);
    });

    it('should balk at too many digits', () => {
      expect(getStateFIPS(100000)).to.eq(null);
    });

  });

  describe('normalizeFIPS', () => {

    it('should return national if given null', () => {
      expect(normalizeFIPS(null)).to.eq(FIPS_NATIONAL);
    });

    it('should return back the same 2-digit state FIPS code', () => {
      var stateFIPS = '41000';
      expect(normalizeFIPS(stateFIPS)).to.eq(stateFIPS);
    })

    it('should return back the same 1-digit state FIPS code', () => {
      var stateFIPS = '06000';
      expect(normalizeFIPS(stateFIPS)).to.eq(stateFIPS);
    })

    it('should return back the same county FIPS code', () => {
      var countyFIPS = '41029';
      expect(normalizeFIPS(countyFIPS)).to.eq(countyFIPS);
    });

    it('should return national if given national', () => {
      expect(normalizeFIPS(FIPS_NATIONAL)).to.eq(FIPS_NATIONAL);
    });

    it('should return national if given as 99 state code string', () => {
      expect(normalizeFIPS('99')).to.eq(FIPS_NATIONAL);
    });

    it('should return national if given as 99 state code int', () => {
      expect(normalizeFIPS(99)).to.eq(FIPS_NATIONAL);
    });

    it('should handle 2-digit state fips if given as int', () => {
      expect(normalizeFIPS(41)).to.eq('41000');
    });

    it('should handle 1-digit state fips if given as int', () => {
      expect(normalizeFIPS(6)).to.eq('06000');
    });

    it('should handle 2-digit state fips if given as string', () => {
      expect(normalizeFIPS('41')).to.eq('41000');
    });

    it('should handle 1-digit state fips if given as string', () => {
      expect(normalizeFIPS('6')).to.eq('06000');
    });

    it('should handle county fips if given as int', () => {
      expect(normalizeFIPS(41027)).to.eq('41027');
    });

  });

  describe('getFipsType', () => {

    it('should return null if given null', () => {
      expect(getFipsType(null)).to.be.null;
    });

    it('should return national for national', () => {
      expect(getFipsType(nationalFIPS)).to.eq('national');
    });

    it('should return state for state', () => {
      expect(getFipsType(stateFIPS)).to.eq('state');
    });

    it('should return county for county', () => {
      expect(getFipsType(countyFIPS)).to.eq('county');
    });

  });

  describe('isFipsNational', () => {

    it('should return false if given null', () => {
      expect(isFipsNational(null)).to.be.false;
    });

    it('should return true for national', () => {
      expect(isFipsNational(nationalFIPS)).to.be.true;
    });

    it('should return false for state', () => {
      expect(isFipsNational(stateFIPS)).to.be.false;
    });

    it('should return false for county', () => {
      expect(isFipsNational(countyFIPS)).to.be.false;
    });

  });

  describe('isFipsState', () => {

    it('should return false if given null', () => {
      expect(isFipsState(null)).to.be.false;
    });

    it('should return false for national', () => {
      expect(isFipsState(nationalFIPS)).to.be.false;
    });

    it('should return true for state', () => {
      expect(isFipsState(stateFIPS)).to.be.true;
    });

    it('should return false for county', () => {
      expect(isFipsState(countyFIPS)).to.be.false;
    });

  });

  describe('isFipsCounty', () => {

    it('should return false if given null', () => {
      expect(isFipsCounty(null)).to.be.false;
    });

    it('should return false for national', () => {
      expect(isFipsCounty(nationalFIPS)).to.be.false;
    });

    it('should return false for state', () => {
      expect(isFipsCounty(stateFIPS)).to.be.false;
    });

    it('should return true for county', () => {
      expect(isFipsCounty(countyFIPS)).to.be.true;
    });

  });

  describe('getFipsFromStateCounty', () => {

    it('should return null if given both nulls', () => {
      expect(getFipsFromStateCounty(null, null)).to.be.null;
    });

    it('should return null if given both blank', () => {
      expect(getFipsFromStateCounty('', '')).to.be.null;
    });

    it('should handle string and null', () => {
      expect(getFipsFromStateCounty('41', null)).to.eq('41000');
    });

    it('should handle integer and null', () => {
      expect(getFipsFromStateCounty(41, null)).to.eq('41000');
    });

    it('should handle both string', () => {
      expect(getFipsFromStateCounty('41', '029')).to.eq('41029');
    });

    it('should handle integer and padded string', () => {
      expect(getFipsFromStateCounty(41, '029')).to.eq('41029');
    });

    it('should handle integer and non-padded string', () => {
      expect(getFipsFromStateCounty(41, '29')).to.eq('41029');
    });

    it('should handle string and integer', () => {
      expect(getFipsFromStateCounty('41', 29)).to.eq('41029');
    });

    it('should not allow null and integer', () => {
      expect(getFipsFromStateCounty(null, 29)).to.be.null;
    });

    it('should not allow null and string', () => {
      expect(getFipsFromStateCounty(null, '029')).to.be.null;
    });

    it('should turn national into 00000', () => {
      expect(getFipsFromStateCounty(99, null)).to.eq('00000');
    });

    it('should handle single digit state', () => {
      expect(getFipsFromStateCounty(6, null)).to.eq('06000');
    });
  });

});
