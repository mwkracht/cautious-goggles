import React from 'react';
import PropTypes from 'prop-types';

const NetForgePoints = ({ required, placed }) => {
  const difference = required - placed;
  const negClass = 'has-text-success';
  const posClass = 'has-text-danger';

  if (difference === 0) {
    return (
      <p>{placed}</p>
    )
  } else if (placed === 0 || placed == null) {
    return (
      <p>0 ({required})</p>
    )
  } else if (difference < 0) {
    return (
      <p>{placed} (<span className={negClass}>{Math.abs(difference)}</span>)</p>
    )
  } else {
    return (
      <p>{placed} (<span className={posClass}>{difference}</span>)</p>
    )
  }
}

NetForgePoints.propTypes = {
  required: PropTypes.number.isRequired,
  placed: PropTypes.number,
}

export default NetForgePoints;
