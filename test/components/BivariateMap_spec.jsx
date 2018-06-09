import React from 'react/addons';
import BivariateMap from '../../src/components/BivariateMap';
import {expect} from 'chai';

const {renderIntoDocument, scryRenderedDOMComponentsWithTag} = React.addons.TestUtils;

describe('BivariateMap', () => {

  xdescribe('detail level', () => {

    it('by default should not render bubbles', () => {
      const detail    = ["land", "states", "counties"];
      const component = renderIntoDocument(<BivariateMap detail={detail} />);
    });

  });

});

