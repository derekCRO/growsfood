import React                          from 'react';
import PureRenderMixin                from 'react-addons-pure-render-mixin';
import {connect}                      from 'react-redux';
import ProductDropdown                from '../components/ProductDropdown';
import MapContainer                   from '../components/MapContainer';
import StatsContainer                 from '../components/StatsContainer';
import Title                          from '../components/Title';
import * as actionCreators            from '../action_creators';
import {getLabel, getQueryUnits}      from '../label';
import {getStateFIPS}                 from '../fips';
import {productData, getDataForQuery} from '../products';

export const MainNaked = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <div className="ui container">

        <div className="ui stackable grid">

          <div className="ui row">
            <div className="fourteen wide centered column">
              <ProductDropdown
                product={this.props.product}
                handleChange={this.props.setProduct}
              />
            </div>
          </div>

          <div className="ui row">
            <div className="fourteen wide centered column">
              <MapContainer
                selected={this.props.selected}
                label={this.props.label}
                productData={this.props.product_data}
                productUnits={this.props.product_units}
                detailLevel={this.props.detail_level}
                onFIPSClick={this.props.setRegion}
                countyLineFilter={this.countyLineFilter}
              />
            </div>
          </div>

          <div className="ui row">
            <div className="fourteen wide centered column">
              <Title label={this.props.label} />
            </div>
          </div>

          <div className="ui row">
            <div className="fourteen wide centered column">
              <StatsContainer
                productData={this.props.product_data}
                onFIPSClick={this.props.setRegion}
              />
            </div>
          </div>

        </div>

      </div>
    );
  },

  countyLineFilter: function(location) {
    return getStateFIPS(location.id) == this.props.selected_state;
  }

});

const mapStateToProps = (state) => ({
  product:         state.get('product'),
  product_data:    getDataForQuery(state.get('product')),
  product_units:   getQueryUnits(state.get('product')),
  selected:        state.get('selected'),
  selected_state:  getStateFIPS(state.get('selected')),
  label:           getLabel(state),
  detail_level:    state.get('detail')
});

export const Main = connect(mapStateToProps, actionCreators)(MainNaked);


