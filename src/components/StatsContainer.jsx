import React             from 'react';
import PureRenderMixin   from 'react-addons-pure-render-mixin';
import Title             from './Title';
import VerticalHistogram from './VerticalHistogram';
import {Treemap}         from 'react-d3';
import {getRegionLabel}  from '../label';
import {isFipsState}     from '../fips';

export default React.createClass({
  mixins: [PureRenderMixin],

  dataForBarChart: function() {
    var data = this.props.productData.fips;

    if(!data) { return []; }

    var
      keys = Object.keys(data),
      stateKeys = keys.filter(key => isFipsState(key))
    ;

    return stateKeys.map(key => ({ fips: key, label: getRegionLabel(key), value: data[key] }));
  },

  render: function() {
    return (
      <div className="stats-container">
        <VerticalHistogram
          data={this.dataForBarChart()}
          width={960}
          height={200}
          onFIPSClick={this.props.onFIPSClick}
        />
      </div>
    );
  }

});

