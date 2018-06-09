import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';

export default React.createClass({
  mixins: [PureRenderMixin],

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  render: function() {
    // thanks to http://bl.ocks.org/mbostock/3885304

    var
      data           = this.props.data || [],
      sorted         = data.sort(function(a, b) { return b.value - a.value }), // descending
      chartWidth     = this.props.width,
      barHeight      = 24,
      barPadding     = 4,
      chartHeight    = barHeight * data.length,
      xScaleFunction = d3.scale.linear().range([0, chartWidth]),
      formatFunction = this.numberWithCommas
    ;

    xScaleFunction.domain([0, d3.max(data, function(d) { return d.value; })])

    return (
      React.DOM.svg({
        width: chartWidth,
        height: chartHeight,
        className: "chart"
      },
        sorted.map(function(d, i) {
          var
            barWidth       = xScaleFunction(d.value),
            xPos           = chartWidth - barWidth,
            yPos           = i * barHeight,
            formattedValue = formatFunction(d.value),
            groupPosition  = "translate(" + xPos + "," + yPos + ")",
            labelUnits     = ' acres',
            label          = barWidth > 100 ? formattedValue + labelUnits : '',
            labelX         = 3,
            labelY         = barHeight / 2 - 2,
            regionName     = d.label,
            regionX        = barWidth + 50,
            regionY        = barHeight / 2 + 2
          ;

          return (
            React.DOM.g({
              transform: groupPosition
            },
              React.DOM.rect({
                className: "bar",
                width: barWidth,
                height: barHeight - barPadding
              }),
              React.DOM.text({
                className: "valueLabel",
                x: labelX,
                y: labelY,
                dy: "0.35em"
              }, label),
              React.DOM.text({
                className: "regionLabel",
                x: regionX,
                y: regionY,
                dy: "0.35em"
              }, regionName)
            )
          )
        })
      )
    );
  }

});
