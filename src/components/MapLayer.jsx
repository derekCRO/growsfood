import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3'
import {d3path} from '../geography';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      React.DOM.path({
        className: this.props.className,
        d: d3path(this.props.topoJSON)
      })
    );
  }

});
