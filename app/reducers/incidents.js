import * as ActionTypes from '../constants/ActionTypes';

const initialState = [];

const actionsMap = {
  [ActionTypes.ADD_INCIDENT](state, action) {
    const unique_incident = x => x.id !== action.incident.id

    if (state.every(unique_incident)) {
      return [action.incident, ...state];
    } else {
      return [...state];
    }
  },
  [ActionTypes.CLEAR_INCIDENTS](state, action) {
    return initialState;
  }
};

export default function incidents(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
