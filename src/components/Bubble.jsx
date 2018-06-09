import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Circle} from 'react-d3';
import {d3path} from '../geography';
import {getStateFIPS} from '../fips';

export default React.createClass({
  mixins: [PureRenderMixin],

  getCentroid: function() {
    return d3path.centroid(this.props.location);
  },

  getRadius: function() {
    return this.props.scaleFunction(this.props.value);
  },

  render: function() {
    return (
      React.DOM.circle({
        className: "bubble",
        key: this.props.fips, // to silence react warnings
        id: this.props.fips, // to actually use in application
        r: this.getRadius(),
        transform: `translate(${this.getCentroid()})`,
        onClick: this.props.handleClick
      })
    );
  }

});


