import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import NetForgePoints from "./NetForgePoints";
import ArcBonusInput from "./ArcBonusInput";
import { connect } from 'react-redux';
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SmallFAIcon = ({ className, fa }) => {
  return (
    <span className={className + " icon is-small"} style={{verticalAlign: "middle"}}>
      <FontAwesomeIcon icon={fa} />
    </span>
  )
}

@connect(
  state => ({
    greatBuilding: state.greatBuilding
  }),
)
export default class GBInvestment extends React.Component {

  static propTypes = {
    greatBuilding: PropTypes.object.isRequired,
  };

  state = {
    arcBonuses: Array(6).fill(this.props.arcBonus || 1.90)
  };

  renderRow = (_row, rowIndex) => {
    const { rewards, rewardsBonus, fpToSecure, fpForSpot, isPlaced } = _row;

    function LockCell(props) {
      const { fpToSecure, rewards } = props;
      if (rewards === 0) {
        return <td className="has-text-right">--</td>;
      } else if (fpToSecure) {
        return (<td className="has-text-right has-text-danger">{fpToSecure}</td>);
      } else if (rewards) {
        return <td className="has-text-right has-text-success"><SmallFAIcon fa={faLock} /></td>;
      }
    }

    return (
      <tr key={`row-${rowIndex}`}>
        <td className="has-text-right">{rowIndex + 1}</td>
        <td className="has-text-right">{rewards}</td>
        <td className="has-text-right">{rewardsBonus}</td>
        <LockCell fpToSecure={fpToSecure} rewards={rewards} />
        <td className="has-text-right">
          <NetForgePoints required={rewardsBonus} placed={isPlaced ? fpForSpot : 0} />
        </td>
        <td>
          {rowIndex < 5 &&
            <ArcBonusInput arcBonus={this.state.arcBonuses[rowIndex]}
                           updateArcBonus={this.handleArcBonusChange}
                           id={rowIndex} />
          }
        </td>
      </tr>
    )
  };

  generateRows = (fpToNextLevel, fpPlacedByOwner, fpRewards, fpPlacedByOthers) => {
    let remainingFp = fpToNextLevel - fpPlacedByOwner - fpPlacedByOthers.reduce((a,b) => a + b, 0);
    let totalFpToSecure = 0;
    let rows = [];

    for (let i = 0; i < (this.state.arcBonuses.length - 1); i++) {
      let currRewards = fpRewards[0] || 0;
      let currRewardsBonus = Math.round(currRewards * this.state.arcBonuses[i]);
      let currPlaced = fpPlacedByOthers[0] || 0;
      let nextPlaced = fpPlacedByOthers[1] || 0;

      if ( (currPlaced - nextPlaced) >= remainingFp ) {
        // currPlaced has locked currRewards
        rows.push({
          rewards: currRewards,
          rewardsBonus: currRewardsBonus,
          fpToSecure: totalFpToSecure,
          fpForSpot: currPlaced,
          isPlaced: true
        })

        fpPlacedByOthers = fpPlacedByOthers.slice(1);
      } else if ( remainingFp < currRewardsBonus ) {
        // spot can only be filled up to remaining FP
        rows.push({
          rewards: currRewards,
          rewardsBonus: currRewardsBonus,
          fpToSecure: totalFpToSecure,
          fpForSpot: remainingFp,
          isPlaced: false
        })

        remainingFp = 0;
      } else {
        let fpToSecure = (remainingFp + currPlaced) - (2 * currRewardsBonus);
        fpToSecure = fpToSecure < 0 ? 0 : fpToSecure;
        totalFpToSecure = totalFpToSecure + fpToSecure;

        if ( currPlaced >= currRewardsBonus ) {
          // assume spot won't be filled by another player
          rows.push({
            rewards: currRewards,
            rewardsBonus: currRewardsBonus,
            fpToSecure: totalFpToSecure,
            fpForSpot: currPlaced,
            isPlaced: true
          })

          remainingFp = remainingFp - fpToSecure;
          fpPlacedByOthers = fpPlacedByOthers.slice(1);
        } else {
          // assume position will be filled up to currRewardsBonus
          rows.push({
            rewards: currRewards,
            rewardsBonus: currRewardsBonus,
            fpToSecure: totalFpToSecure,
            fpForSpot: currRewardsBonus,
            isPlaced: false
          })

          remainingFp = remainingFp - fpToSecure - currRewardsBonus;
        }
      }
      fpRewards = fpRewards.slice(1);
    }

    for (const fpPlacedByOther of fpPlacedByOthers) {
      rows.push({
        rewards: 0,
        rewardsBonus: 0,
        fpTosecure: 0,
        fpForSpot: fpPlacedByOther,
        isPlaced: true
      })
    }

    return rows;
  };

  calculateOwnerInvestment = (fpToNextLevel, rows) => {
    let sumFpPlaced = rows.reduce((prev,next) => prev + (next.fpForSpot), 0);
    return fpToNextLevel - sumFpPlaced;
  };

  handleArcBonusChange = (bonus, id) => {
    if (id === 5) {
      this.setState({
        arcBonuses: Array(6).fill(bonus)
      })
    } else {
      this.setState({
        arcBonuses: update(this.state.arcBonuses, {[id]: {$set: bonus}})
      })
    }
  };

  render() {
    const {
      greatBuilding : { 
        name, currentLevel, fpToNextLevel, fpPlacedByOwner, fpRewards, fpPlacedByOthers, ownerName
      }
    } = this.props;

    const rows = this.generateRows(fpToNextLevel, fpPlacedByOwner, fpRewards, fpPlacedByOthers);
    const tbodyMarkup = rows.map(this.renderRow);
    const totalFpPlaced = fpPlacedByOwner + fpPlacedByOthers.reduce((a,b) => a + b, 0);

    const fpOwnerInvestment = this.calculateOwnerInvestment(fpToNextLevel, rows);
  
    return (
      <div className="GBInvestment table-wrapper">
        <table className="table is-bordered is-striped is-narrow is-fullwidth">
          <thead>
            <tr>
              <th colSpan="6" className="has-text-centered">
                <progress max={fpToNextLevel} className="progress is-success" value={totalFpPlaced} style={{marginBottom: "0px"}}></progress>
                <p>{totalFpPlaced}/{fpToNextLevel}  ({fpToNextLevel - totalFpPlaced})</p>
              </th>
            </tr>
            <tr>
              <th colSpan="5">Global Arc Bonus</th>
              <td>
                <ArcBonusInput arcBonus={this.state.arcBonuses[5]} updateArcBonus={this.handleArcBonusChange} id={5}/>
              </td>
            </tr>
            <tr>
              <th colSpan="1" />
              <th colSpan="2">Rewards</th>
              <th>Lock</th>
              <th>Placed</th>
              <th width="65px">Arc</th>
            </tr>
          </thead>
          <tbody>{tbodyMarkup}</tbody>
          <tfoot>
            <tr>
              <th colSpan="5">Total investment of the owner</th>
              <td className="has-text-right">{fpOwnerInvestment}</td>
            </tr>
            <tr>
              <th colSpan="5">Level cost</th>
              <td className="has-text-right">{fpToNextLevel}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}