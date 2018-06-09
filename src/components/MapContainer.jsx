import React           from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import BivariateMap    from './BivariateMap';

export default React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <div className="map-container">
      <BivariateMap
        width="960"
        height="500"
        productData={this.props.productData}
        units={this.props.productUnits}
        detailLevel={this.props.detailLevel}
        onFIPSClick={this.props.onFIPSClick}
        selectedFIPS={this.props.selected}
        countyLineFilter={this.props.countyLineFilter}
      />
    </div>;
  }

});
