import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ArcBonusInput.css';

const ArcBonusInput = (props) => {
 const handleChange = (event) => {
    props.updateArcBonus(parseFloat(event.target.value), parseInt(event.target.id));
  };

  return (
    <input className="arc-bonus-input"
           type="number"
           min="0"
           step="0.01"
           value={props.arcBonus}
           onChange={handleChange}
           id={props.id} />
  );
}

ArcBonusInput.propTypes = {
  arcBonus: PropTypes.number.isRequired,
  updateArcBonus: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
};

export default ArcBonusInput;
