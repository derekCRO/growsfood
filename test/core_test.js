import {expect} from 'chai';
import {Map, List, fromJS} from 'immutable';
import {INITIAL_STATE, DEFAULT_LABEL} from '../src/constants';
import {select, product} from '../src/core';

describe('application logic', () => {

  const stateName    = 'Oregon';
  const stateFIPS    = '41000';
  const countyName   = 'Jackson County, OR';
  const countyFIPS   = '41029';
  const stateZoomXYZ = List([1, 2, 3]);

  describe('defaults', () => {

    it('should not have any product selected', () => {
      expect(INITIAL_STATE.get('product')).to.be.null;
    });

    it('should not have any stat selected', () => {
      expect(INITIAL_STATE.get('stat')).to.be.null;
    });

    it('should not have any selected region', () => {
      expect(INITIAL_STATE.get('selected')).to.be.null;
    });

    it('should draw country and state boundaries', () => {
      var detailLayers = INITIAL_STATE.get('detail');
      expect(detailLayers).to.contain('land');
      expect(detailLayers).to.contain('states');
      expect(detailLayers).to.not.contain('counties');
    });

    it('should not have any histograms', () => {
      expect(INITIAL_STATE.get('histograms')).to.be.empty;
    });

  });

  describe('select', () => {

    describe('null', () => {

      var newState = select(select(INITIAL_STATE, stateFIPS), null);

      it('should remove id of selected region and set to national', () => {
        expect(newState.get('selected')).to.eq('00000');
      });

      it('should remove counties from detail layers', () => {
        var detailLayers = newState.get('detail');
        expect(detailLayers).to.contain('land');
        expect(detailLayers).to.contain('states');
        expect(detailLayers).to.not.contain('counties');
      });

    });

    describe('state level', () => {

      var newState = select(INITIAL_STATE, stateFIPS);

      it('should set the id of the selected region', () => {
        expect(newState.get('selected')).to.eq(stateFIPS);
      });

      it('should draw county borders', () => {
        var detailLayers = newState.get('detail');
        expect(detailLayers).to.contain('land');
        expect(detailLayers).to.contain('states');
        expect(detailLayers).to.contain('counties');
      });

      it('should set zoom to XYZ of state', () => {
        expect(newState.get('zoom')).to.eq(stateZoomXYZ);
      });

    });

    describe('county level', () => {

      var newState = select(INITIAL_STATE, countyFIPS);

      it('should set the id of the selected region', () => {
        expect(newState.get('selected')).to.eq(countyFIPS);
      });

      xit('should draw county borders', () => {
        var detailLayers = newState.get('detail');
        expect(detailLayers).to.contain('land');
        expect(detailLayers).to.contain('states');
        expect(detailLayers).to.contain('counties');
      });

      it('should set zoom to XYZ of state', () => {
        expect(newState.get('zoom')).to.eq(stateZoomXYZ);

      });

    });

  });

});
