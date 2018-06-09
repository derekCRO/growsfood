import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {landTopoJSON, stateTopoJSON, stateTopoMesh, countyTopoJSON, countyTopoMesh, d3path, getTopoJSONFromFIPS} from '../geography.js'
import {getStateFIPS, normalizeFIPS, isFipsState} from '../fips';
import {getDataFilterBySelectedFIPS, dataFilterCounties} from '../data';

import MapLayer          from './MapLayer';
import ClickableMapLayer from './ClickableMapLayer';
import FilteredMapLayer  from './FilteredMapLayer';
import Bubbles           from './Bubbles';
import BubbleLegend      from './BubbleLegend';

export default React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps: function() {
    return {
      width: 960,
      height: 500,
      detailLevel: ['land', 'states']
    }
  },

  getInitialState: function() {
    return {
      active: d3.select(null)
    }
  },

  handleMapClick: function(event) {
    var
      clickedFIPS       = this.getEventFIPS(event),
      clickedStateFIPS  = getStateFIPS(clickedFIPS)
    ;

    if(isFipsState(clickedFIPS) && (this.props.selectedFIPS === clickedFIPS)) {
      // if click same location again, should reset instead
      // also, only if you click a state
      this.props.onFIPSClick(null);
    } else {
      // update app state based on clicked item
      this.props.onFIPSClick(clickedFIPS);
    }
  },

  getEventFIPS: function(event) {
    return normalizeFIPS(event.target.id);
  },

  scaleFunction: null,

  quantFunction: null,

  colorFunction: null,

  componentWillUpdate: function(nextProps, nextState) {
    // no need to do anything if we ain't got no data!
    if(!nextProps.productData) { return true; }

    var
      // I'm not sure what I was thinking with this one ...
      //dataFilter   = getDataFilterBySelectedFIPS(this.props.selectedFIPS),
      newDataPoints = nextProps.productData.fips,
      filteredData  = dataFilterCounties(newDataPoints),
      fipsKeys      = Object.keys(filteredData),
      values        = fipsKeys.map(key => filteredData[key]),
      max           = Math.max.apply(null, values)  // seriously? wtf
    ;

    // set scale method using max value from data
    this.scaleFunction = d3.scale.sqrt().domain([0, max]).range([0, 7]);
    this.quantFunction = d3.scale.quantile().domain([0, max]).range([1, 3, 5, 7]);

    // TODO: set color range based on quantile
    this.colorFunction = null;
  },

  componentDidUpdate: function() {
    // if there's a topoJSON object associated with this selected FIPS
    // then go ahead and zoom into that region for a closer look
    if(this.getSelectedTopoJSON()) {
      this.d3ZoomIn();
    } else {
      this.d3ZoomOut();
    }
  },

  getSelectedTopoJSON: function() {
    var
      stateFIPS = getStateFIPS(this.props.selectedFIPS),
      topoJSON  = getTopoJSONFromFIPS(stateFIPS)
    ;

    return topoJSON;
  },

  d3ZoomIn: function() {
    var
      width     = this.props.width,
      height    = this.props.height,
      d         = this.getSelectedTopoJSON(),
      bounds    = d3path.bounds(d),
      dx        = bounds[1][0] - bounds[0][0],
      dy        = bounds[1][1] - bounds[0][1],
      x         = (bounds[0][0] + bounds[1][0]) / 2,
      y         = (bounds[0][1] + bounds[1][1]) / 2,
      scale     = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y],
      wrapper   = d3.select('g')
    ;

    wrapper.transition()
        .duration(750)
        .ease("circle-in-out")
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
    ;
  },

  d3ZoomOut: function() {
    d3.select('g').transition()
        .duration(750)
        .ease("circle-in-out")
        .style("stroke-width", "1.5px")
        .attr("transform", "")
    ;
  },

  getShade: function(fips) {
    return null;
  },

  getSize: function(fips) {
    return null;
  },

  colorbrewer: function() {
    return "#F0F";
  },

  showDetailLevel: function(level) {
    return this.props.detailLevel.includes(level);
  },

  render: function() {
    return (
      <div className="map">
        <svg viewBox={"0 0 " + this.props.width + " " + this.props.height} onClick={this.handleMapClick}>
          <g>
            {this.showDetailLevel('land') ?
              <MapLayer
                topoJSON={landTopoJSON}
                className="land"
              />
            : null }
            {this.showDetailLevel('states') ?
              <ClickableMapLayer
                topoJSON={stateTopoJSON}
                className="feature"
                handleClick={this.handleMapClick}
              />
            : null }
            {this.showDetailLevel('states') ?
              <MapLayer
                topoJSON={stateTopoMesh}
                className="states"
              />
            : null }
            {this.showDetailLevel('counties') ?
              <FilteredMapLayer
                topoJSON={countyTopoJSON}
                className="counties"
                data={this.props.productData}
                filterFunction={this.props.countyLineFilter}
                selectedFIPS={this.props.selectedFIPS}
              />
            : null }
            <Bubbles
              topoJSON={countyTopoJSON}
              className="bubbles"
              data={this.props.productData}
              handleClick={this.handleMapClick}
              scaleFunction={this.scaleFunction}
            />
            <BubbleLegend
              units={this.props.units}
              cx={this.props.width}
              cy={this.props.height - 50}
              quantFunction={this.quantFunction}
            />
          </g>
        </svg>
      </div>
   );
  }
});
