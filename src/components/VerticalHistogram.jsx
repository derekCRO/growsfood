import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import VerticalHistogramBar from './VerticalHistogramBar';

export default React.createClass({
  mixins: [PureRenderMixin],

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  handleBarClicked: function(event) {
    return this.props.onFIPSClick(this.getEventFIPS(event));
  },

  getEventFIPS: function(event) {
    return event.target.getAttribute('data-fips');
  },

  render: function() {
    // thanks to http://bl.ocks.org/mbostock/3885304

    var
      data           = this.props.data || [],
      sorted         = data.sort(function(a, b) { return b.value - a.value }), // descending
      totalItems     = sorted.length,
      maxItems       = 40,
      itemOverage    = totalItems - maxItems,
      tooManyItems   = itemOverage > 0,
      sliced         = tooManyItems ? sorted.slice(0, maxItems - 1) : sorted,
      overageLabel   = tooManyItems ? (itemOverage + 1) + ' locations not shown' : '',
      chartWidth     = this.props.width,
      chartHeight    = this.props.height,
      yScaleFunction = d3.scale.linear().range([0, chartHeight]),
      formatFunction = this.numberWithCommas,
      handleClick    = this.handleBarClicked
    ;

    yScaleFunction.domain([0, d3.max(data, function(d) { return d.value; })])

    return (
      React.DOM.svg({
        viewBox: "0 0 " + chartWidth + " " + chartHeight,
        className: "chart"
      },
        sliced.map(function(d, barIndex) {
          return (
            <VerticalHistogramBar
              fips={d.fips}
              value={d.value}
              label={d.label}
              barIndex={barIndex}
              width={24}
              padding={4}
              chartWidth={chartWidth}
              chartHeight={chartHeight}
              formatFunction={formatFunction}
              scaleFunction={yScaleFunction}
              onClick={handleClick}
            />
          )
        }),
        React.DOM.text({
          className: "overageLabel",
          x: -205,
          y: 15,
          dy: "0.35em",
          transform: "rotate(" + 270 + ")"
        }, overageLabel)
      )
    );
  }

});

