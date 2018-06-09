import {expect} from 'chai';
import {Map, List, fromJS} from 'immutable';

import {topoJSON, landTopoJSON, stateTopoJSON, countyTopoJSON, stateTopoJSONByFIPS, getTopoJSONFromFIPS} from '../src/geography';
import {normalizeFIPS} from '../src/fips';

describe('geography', () => {

  var validStateFIPSCodes = [1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56, 72, 78];

  describe('topoJSON', () => {

    it('should be defined', () => {
      expect(topoJSON).to.be.ok;
    });

  });

  describe('landTopoJSON', () => {

    it('should be defined', () => {
      expect(landTopoJSON).to.be.ok;
    });

  });

  describe('stateTopoJSON', () => {

    it('should be defined', () => {
      expect(stateTopoJSON).to.be.ok;
    });

  });

  describe('countyTopoJSON', () => {

    it('should be defined', () => {
      expect(countyTopoJSON).to.be.ok;
    });

  });

  describe('stateTopoJSONByFIPS', () => {

    var
      keys = Object.keys(stateTopoJSONByFIPS)
    ;

    it(`should have ${validStateFIPSCodes.length} objects`, () => {
      expect(keys).to.have.length(validStateFIPSCodes.length);
    });

    it('should have one for each state', () => {
      expect(keys.sort()).to.eql(
        validStateFIPSCodes.map(fips => normalizeFIPS(fips)).sort()
      );
    });

    it('should return a geo json object', () => {
      expect(stateTopoJSONByFIPS['41000'].geometry).to.be.ok;
    });

  });

  describe('getTopoJSONFromFIPS', () => {

    it('should handle null fips', () => {
      expect(getTopoJSONFromFIPS(null)).to.be.null;
    });

    it('should handle invalid fips', () => {
      expect(getTopoJSONFromFIPS('99999')).to.be.null;
    });

    it('should return correct fips if exists', () => {
      expect(getTopoJSONFromFIPS('41000').id).to.eq(41);
    });

    it('should handle short string', () => {
      expect(getTopoJSONFromFIPS('41').id).to.eq(41);
    });

    it('should handle integer fips', () => {
      expect(getTopoJSONFromFIPS(41).id).to.eq(41);
    });

  });

});
