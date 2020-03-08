import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import ArcBonusInput from "./ArcBonusInput";
import { connect } from 'react-redux';

@connect(
  state => ({
    greatBuilding: state.greatBuilding
  }),
)
export default class GBSnipe extends React.Component {

  static propTypes = {
    greatBuilding: PropTypes.object.isRequired,
  };

  state = {
    arcBonus: this.props.arcBonus || 1.90
  };

  calculateSnipe = (fpToNextLevel, fpPlacedByOwner, fpRewards, fpPlacedByOthers) => {
    let remainingFp = fpToNextLevel - fpPlacedByOwner - fpPlacedByOthers.reduce((a,b) => a + b, 0);

    for (let i = 0; i < fpRewards.length; i++) {
      let currRewards = fpRewards[i];
      let currRewardsBonus = Math.round(currRewards * this.state.arcBonus);
      let currPlaced = fpPlacedByOthers[0] || 0;

      if ( remainingFp <= currPlaced ) {
        fpPlacedByOthers = fpPlacedByOthers.slice(1);
      } else {
        // currPlaced has not locked currRewards
        var fpToLock = Math.round((remainingFp - currPlaced) / 2) + currPlaced;
        return {
          cost: fpToLock,
          rewards: currRewardsBonus
        }
      }
    }

    return {
      cost: 0,
      rewards: 0,
    };
  };


  handleArcBonusChange = (bonus, id) => {
    this.setState({
      arcBonus: bonus
    })
  };

  render() {
    const {
      greatBuilding : { 
        name, currentLevel, fpToNextLevel, fpPlacedByOwner, fpRewards, fpPlacedByOthers, ownerName 
      }
    } = this.props;

    const { cost, rewards } = this.calculateSnipe(fpToNextLevel, fpPlacedByOwner, fpRewards, fpPlacedByOthers);
  
    return (
      <div className="GBSnipe table-wrapper">
        <table className="table is-bordered is-striped is-narrow is-fullwidth">
          <thead>
            <tr>
              <th colSpan="3">Your Arc Bonus</th>
              <td width="90px">
                <ArcBonusInput arcBonus={this.state.arcBonus} updateArcBonus={this.handleArcBonusChange} id={0}/>
              </td>
            </tr>
          </thead>
          {cost && (cost <= rewards) ? (
            <tbody>
              <tr>
                <td colSpan="3">FP Cost</td>
                <td className="has-text-right">{cost}</td>
              </tr>
              <tr>
                <td colSpan="3">FP Earned</td>
                <td className="has-text-right">{rewards}</td>
              </tr>
              <tr>
                <th colSpan="3">Net</th>
                <td className="has-text-right has-text-success">{rewards - cost}</td>
              </tr>
              <tr>
                <th colSpan="3">ROI</th>
                <td className="has-text-right has-text-success">{(((rewards - cost) * 100) / cost).toFixed(0)}%</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr><td colSpan="4">No Snipable Spots...</td></tr>
            </tbody>
          )}
        </table>
      </div>
    );
  }
}