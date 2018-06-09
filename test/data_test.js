import {expect} from 'chai';
import {Map, List, fromJS} from 'immutable';
import {INITIAL_STATE} from '../src/constants';
import {FIPS_NATIONAL} from '../src/fips';
import {dataFilterNational, dataFilterStates, dataFilterCounties} from '../src/data';

describe('data', () => {

  describe('filter data by region', () => {

    var
      nationalFIPS = FIPS_NATIONAL,
      nationalData = 'national data',
      stateFIPS    = '41000',
      stateData    = 'state data',
      countyFIPS   = '41027',
      countyData   = 'county data',
      data         = {}
    ;

    data[nationalFIPS] = nationalData;
    data[stateFIPS]    = stateData;
    data[countyFIPS]   = countyData;
    data.stats         = { units: 'FAKE', totals: {} };

    describe('dataFilterNational', () => {

      var
        result = dataFilterNational(data)
      ;

      it('should return empty object for null', () => {
        expect(dataFilterNational(null)).to.eql({});
      });

      it('should return empty object for empty object', () => {
        expect(dataFilterNational({})).to.eql({});
      });

      it('should return empty object for invalid object', () => {
        expect(dataFilterNational({test:'value'})).to.eql({});
      });

      it('should return the national level value', () => {
        expect(result).to.include.keys(nationalFIPS);
      });

      it('should have the expected value', () => {
        expect(result[nationalFIPS]).to.eq(nationalData);
      });

      it('should not return the state level value', () => {
        expect(result).to.not.include.keys(stateFIPS);
      });

      it('should not return the county level value', () => {
        expect(result).to.not.include.keys(countyFIPS);
      });

      it('should not return the stats', () => {
        expect(result).to.not.include.keys('stats');
      });

    });

    describe('dataFilterStates', () => {

      var
        result = dataFilterStates(data)
      ;

      it('should return empty object for null', () => {
        expect(dataFilterStates(null)).to.eql({});
      });

      it('should return empty object for empty object', () => {
        expect(dataFilterStates({})).to.eql({});
      });

      it('should return empty object for invalid object', () => {
        expect(dataFilterStates({test:'value'})).to.eql({});
      });

      it('should not return the national level value', () => {
        expect(result).to.not.include.keys(nationalFIPS);
      });

      it('should return the state level value', () => {
        expect(result).to.include.keys(stateFIPS);
      });

      it('should have the expected value', () => {
        expect(result[stateFIPS]).to.eq(stateData);
      });

      it('should not return the county level value', () => {
        expect(result).to.not.include.keys(countyFIPS);
      });

      it('should not return the stats', () => {
        expect(result).to.not.include.keys('stats');
      });

    });

    describe('dataFilterCounties', () => {

      var
        result = dataFilterCounties(data)
      ;

      it('should return empty object for null', () => {
        expect(dataFilterCounties(null)).to.eql({});
      });

      it('should return empty object for empty object', () => {
        expect(dataFilterCounties({})).to.eql({});
      });

      it('should return empty object for invalid object', () => {
        expect(dataFilterCounties({test:'value'})).to.eql({});
      });

      it('should not return the national level value', () => {
        expect(result).to.not.include.keys(nationalFIPS);
      });

      it('should not return the state level value', () => {
        expect(result).to.not.include.keys(stateFIPS);
      });

      it('should return the county level value', () => {
        expect(result).to.include.keys(countyFIPS);
      });

      it('should have the expected value', () => {
        expect(result[countyFIPS]).to.eq(countyData);
      });

      it('should not return the stats', () => {
        expect(result).to.not.include.keys('stats');
      });

    });

  });

});
