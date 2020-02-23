import React, { Component } from 'react';
import GBInvestment from './GBInvestment';
import GBSnipe from './GBSnipe';
import PropTypes from 'prop-types';

export default class MainSection extends Component {

  render() {
    return (
      <div className="MainSection">
        <h4 className="title is-4 has-text-centered" style={{'margin': '0 auto'}}>Invest</h4>
        <GBInvestment />
        <h4 className="title is-4 has-text-centered" style={{'margin': '0 auto'}}>Snipe</h4>
        <GBSnipe />
      </div>
    );
  }
}
