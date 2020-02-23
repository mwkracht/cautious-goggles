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

    for (let i = 0; i < (fpRewards.length - 1); i++) {
      let currRewards = fpRewards[i];
      let currRewardsBonus = Math.round(currRewards * this.state.arcBonus);
      let currPlaced = fpPlacedByOthers[0] || 0;
      let nextPlaced = fpPlacedByOthers[1] || 0;

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
        name, currentLevel, fpToNextLevel, fpPlacedByOwner, fpRewards, fpPlacedByOthers 
      }
    } = this.props;

    const { cost, rewards } = this.calculateSnipe(fpToNextLevel, fpPlacedByOwner, fpRewards, fpPlacedByOthers);
  
    return (
      <div className="GBSnipe table-wrapper">
        <table className="table is-bordered is-striped is-narrow is-fullwidth">
          <thead>
            {name ? (
              <tr><th colSpan="4" className="has-text-centered"><p>{name}: {currentLevel} → {currentLevel + 1}</p></th></tr>
            ) : (
              <tr><th colSpan="4" className="has-text-centered"><p>No Building Selected</p></th></tr>
            )}
            <tr>
              <th colSpan="3">Your Arc Bonus</th>
              <td width="100px">
                <ArcBonusInput arcBonus={this.state.arcBonus} updateArcBonus={this.handleArcBonusChange} id={0}/>
              </td>
            </tr>
          </thead>
          {cost && (cost <= rewards) ? (
            <tbody>
              <tr>
                <td colSpan="3">Forge Point Cost</td>
                <td className="has-text-right">{cost}</td>
              </tr>
              <tr>
                <td colSpan="3">Forge Point Rewards w/ Bonus</td>
                <td className="has-text-right">{rewards}</td>
              </tr>
              <tr>
                <th colSpan="3">Net:</th>
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