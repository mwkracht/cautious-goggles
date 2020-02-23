import React from 'react';
import PropTypes from 'prop-types';
import { faArrowUp, faArrowDown, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SmallFAIcon = ({ className, fa }) => {
  return (
    <span className={className + " icon is-small"} style={{verticalAlign: "middle"}}>
      <FontAwesomeIcon icon={fa} />
    </span>
  )
}

const NetForgePoints = ({ required, placed }) => {
  const difference = required - placed;
  const negClass = 'has-text-success';
  const posClass = 'has-text-danger';

  if (difference === 0) {
    return (
      <p>{placed} (<SmallFAIcon fa={faExchangeAlt} />)</p>
    )
  } else if (placed === 0 || placed == null) {
    return (
      <p>0 ({required})</p>
    )
  } else if (difference < 0) {
    return (
      <p>{placed} (<SmallFAIcon className={negClass} fa={faArrowUp} />{Math.abs(difference)})</p>
    )
  } else {
    return (
      <p>{placed} (<SmallFAIcon className={posClass} fa={faArrowDown} />{difference})</p>
    )
  }
}

NetForgePoints.propTypes = {
  required: PropTypes.number.isRequired,
  placed: PropTypes.number,
}

export default NetForgePoints;
