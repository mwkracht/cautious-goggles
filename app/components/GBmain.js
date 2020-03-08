import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GBInvestment from './GBInvestment';
import GBSnipe from './GBSnipe';


@connect(
  state => ({
    greatBuilding: state.greatBuilding
  }),
)
export default class GBMain extends Component {

  static propTypes = {
    greatBuilding: PropTypes.object.isRequired,
  };

  render() {
    const {
      greatBuilding : { 
        name, currentLevel, ownerName
      }
    } = this.props;

    if (name) {
      return (
        <div className='mt-4 text-center'>
          {ownerName && <h5>{ownerName}</h5>}
          <h6 className='mb-4'>{name}: {currentLevel} → {currentLevel + 1}</h6>
          <h5 className='text-center'>Invest</h5>
          <GBInvestment />
          <h5 className='text-center'>Snipe</h5>
          <GBSnipe />
        </div>
      );
    } else {
      return (
        <p className='text-center m-4'>No Building Selected</p>
      )
    }
  }
}
