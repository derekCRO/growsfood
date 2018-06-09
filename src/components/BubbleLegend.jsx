import React              from 'react';
import PureRenderMixin    from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  render: function() {
    if(!this.props.quantFunction) { return false; }

    var
      legendCx       = this.props.cx,
      legendCy       = this.props.cy,
      quantFunction  = this.props.quantFunction,
      quantiles      = quantFunction.quantiles(),
      quantSize      = quantiles.length,
      quantUnits     = this.props.units,
      formatFunction = this.numberWithCommas
    ;

    // reavers, man
    if(isNaN(quantiles[0])) { return false; }

    return(quantiles?
      React.DOM.g({
        className: "legend",
        transform: "translate(" + legendCx + "," + legendCy + ")"
      },
        quantiles.map(function(quant, quantIndex) {
          var
            value         = quant,
            radius        = quantFunction(value),
            cy            = -radius,
            xOffset       = -50,
            yOffset       = -20,
            bubbleOffsetX = xOffset,
            bubbleOffsetY = ((quantSize - quantIndex) * yOffset),
            roundedQuant  = Math.round((quant / 1000) * 1000),
            quantLabel    = formatFunction(roundedQuant)
          ;
          return(
            React.DOM.g({
              className: "bubbleLegend",
              transform: "translate(" + bubbleOffsetX + ", " + bubbleOffsetY  + ")"
            },
              React.DOM.circle({
                className: "legendBubble",
                cx: -10,
                cy: -5,
                r: radius,
              }),
              React.DOM.text({
                className: "legendText",
                x: 20,
                y: -5,
                dy: "0.35em"
              }, quantLabel)
            )
          );
        }),
        React.DOM.text({
          className: "legendUnits",
          x: -40,
          y: -85,
          dy: "0.35em"
        }, quantUnits)
      )
    :null);
  }

});
