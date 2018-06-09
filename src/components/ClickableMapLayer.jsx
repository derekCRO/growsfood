import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import {d3path} from '../geography';
import transition from 'd3-transition';
import ease from 'd3-ease';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var
      geography = this.props.topoJSON.features
    ;

    return (
      React.DOM.g({},
        geography.map(function(location) {
          return React.DOM.path({
            key: location.id, // to silence warnings
            id: location.id, // to actually use in application
            className: this.props.className,
            d: d3path(location),
            onClick: this.props.handleClick
          })
        }, this)
      )
    );
  }

});
