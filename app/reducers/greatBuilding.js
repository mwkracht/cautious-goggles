import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  name: null,
  currentLevel: null,
  fpRewards: [],
  fpToNextLevel: null,
  fpPlacedByOwner: null,
  fpPlacedByOthers: [],  
};

const actionsMap = {
  [ActionTypes.OPEN_GB](state, action) {
    return action.greatBuilding;
  }
};

export default function greatBuilding(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
