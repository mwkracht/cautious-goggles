import * as types from '../constants/ActionTypes';

export function addMotivation(motivation) {
  return { type: types.ADD_MOTIVATION, motivation };
}

export function clearMotivations() {
  return { type: types.CLEAR_MOTIVATIONS };
}
