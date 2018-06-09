import React              from 'react';
import PureRenderMixin    from 'react-addons-pure-render-mixin';
import {normalizeFIPS}    from '../fips';
import Bubble             from './Bubble';

export default React.createClass({
  mixins: [PureRenderMixin],

  locationFIPS: function(location) {
    return normalizeFIPS(location.id);
  },

  locationValue: function(location) {
    if(!this.props.data.fips) { return null; }
    if(!location)             { return null; }

    var
      data   = this.props.data.fips,
      fips   = this.locationFIPS(location),
      value  = data[fips]
    ;

    return value;
  },

  filteredLocations: function(locations) {
    return locations.filter(location => this.filterLocation(location))
  },

  filterLocation: function(location) {
    var value = this.locationValue(location);
    return (value && value !== null && value !== undefined);
  },

  render: function() {
    var
      locations = this.props.topoJSON.features,
      filtered  = this.filteredLocations(locations)
    ;

    return (
      React.DOM.g({
        className: "bubbles"
      },
        filtered.map(function(location) {
          return (
            <Bubble
              location={location}
              fips={this.locationFIPS(location)}
              value={this.locationValue(location)}
              scaleFunction={this.props.scaleFunction}
              colorFunction={this.props.colorFunction}
              handleClick={this.props.handleClick}
            />
          );
        }, this)
      )
    );
  }

});

