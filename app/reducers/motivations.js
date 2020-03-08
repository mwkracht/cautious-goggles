import * as ActionTypes from '../constants/ActionTypes';

const initialState = [];

const actionsMap = {
  [ActionTypes.ADD_MOTIVATION](state, action) {
    const unique_motivation = x => x.id !== action.motivation.id

    if (state.every(unique_motivation)) {
      return [action.motivation, ...state];
    } else {
      return [...state];
    }
  },
  [ActionTypes.CLEAR_MOTIVATIONS](state, action) {
    return initialState;
  }
};

export default function greatBuilding(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
