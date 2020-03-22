import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from './PageTitle';

const SmallFAIcon = ({ className, fa }) => {
  return (
    <span className={className + " icon is-small"} style={{verticalAlign: "middle"}}>
      <FontAwesomeIcon icon={fa} />
    </span>
  )
}

@connect(
  state => ({
    incidents: state.incidents
  }),
)
export default class Incidents extends React.Component {

  static propTypes = {
    incidents: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      currentTime: new Date(),
    });
  }

  renderRow = (_row, rowIndex) => {
    const { startTime, endTime, rarity, locationHint } = _row;
    const startDateTime = new Date(startTime * 1000);
    const endDateTime = new Date(endTime * 1000);

    function StateCell( props ) {
      const { start, current, expire } = props;

      if ( start < current && current < expire ) {
        return <td  className="has-text-centered"><SmallFAIcon fa={faLockOpen}  className="has-text-success"/></td>;
      } else if ( current < start ) {
        return <td  className="has-text-centered"><SmallFAIcon fa={faLock} className="has-text-warning"/></td>;
      } else {
        return <td  className="has-text-centered"><SmallFAIcon fa={faLock}  className="has-text-danger"/></td>;
      }
    }

    function TimingCell( props ) {
      const { start, current, expire } = props;

      function formatTimeDelta(d1, d2) {
        var delta = Math.floor((d2 - d1) / 1000)

        var seconds = delta % 60
        var minutes = ((delta - seconds) / 60) % 60
        var hours = (delta - seconds - (minutes * 60)) / 3600

        function pad(n, width) {
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }

        return hours + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
      }

      if ( start < current && current < expire ) {
        return <td className="has-text-right">{formatTimeDelta(current, expire)}</td>;
      } else if ( current < start ) {
        return <td className="has-text-right">{formatTimeDelta(current, start)}</td>;
      } else {
        return <td className="has-text-right">Expired</td>;
      }
    }

    return (
      <tr key={`row-${rowIndex}`}>
        <StateCell start={startDateTime} current={this.state.currentTime} expire={endDateTime} />
        <TimingCell start={startDateTime} current={this.state.currentTime} expire={endDateTime} />
        <td className="has-text-centered">{rarity[0].toUpperCase()}</td>
        <td className="has-text-right">{locationHint}</td>
      </tr>
    )
  };

  render() {
    const { incidents } = this.props;
    incidents.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)

    const tbodyMarkup = incidents.map(this.renderRow);
  
    return (
      <div className="Incidents">
        <div className='mt-4 mb-4 text-center'>
          <PageTitle
              title='Incidents'
              help='The state column describes whether the incident is open (green open lock), about
              to open (yellow lock) or expired (red lock). The incident will be in that state until
              the transition counter hits 0 seconds. Rarity can be either C (common), U (uncommon),
              or R (rare). The hint provides a general location description of where the incident
              may be located. If incident data is empty, refresh the game or collect an incident.'
          />
        </div>
        <table className="table is-bordered is-striped is-narrow is-fullwidth">
          <thead>
            <tr>
              <th>State</th>
              <th>Transition</th>
              <th>Rarity</th>
              <th>Hint</th>
            </tr>
          </thead>
          <tbody>{tbodyMarkup}</tbody>
        </table>
      </div>
    );
  }
}