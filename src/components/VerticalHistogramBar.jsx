import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {

    var
      barHeight      = this.props.scaleFunction(this.props.value),
      xOffset        = (this.props.barIndex * this.props.width) + this.props.width - this.props.padding,  // make sure lines up on far-right without going over
      xPos           = this.props.chartWidth - xOffset,
      yPos           = this.props.chartHeight - barHeight,
      formattedValue = this.props.formatFunction(this.props.value),
      groupPosition  = "translate(" + xPos + "," + yPos + ")",
      labelUnits     = ' acres',
      barTooShort    = barHeight < 100,
      label          = formattedValue,
      labelX         = barTooShort ? 5 : -(this.props.width / 2 - 2),
      labelY         = (this.props.width / 2 - 2),
      labelClass     = barTooShort ? 'exterior' : 'interior',
      labelRotate    = 270,
      regionName     = this.props.label,
      regionX        = -(barHeight + 5),
      regionY        = labelY
    ;

    return (
      React.DOM.g({
        transform:   groupPosition,
        className:   'vertical-bar',
        onClick:     this.props.onClick,
        "data-fips": this.props.fips
      },
        React.DOM.rect({
          className: "bar",
          width: this.props.width - this.props.padding,
          height: barHeight,
          "data-fips": this.props.fips
        }),
        React.DOM.text({
          className: "valueLabel " + labelClass,
          x: labelX,
          y: labelY,
          dy: "0.35em",
          transform: "rotate(" + labelRotate + ")",
          "data-fips": this.props.fips
        }, label),
        React.DOM.text({
          className: "regionLabel",
          x: regionX,
          y: regionY,
          dy: "0.35em",
          transform: "rotate(" + labelRotate + ")",
          "data-fips": this.props.fips
        }, regionName)
      )
    );
  }

});
