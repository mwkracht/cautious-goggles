import * as types from '../constants/ActionTypes';

export function addIncident(incident) {
  return { type: types.ADD_INCIDENT,  incident};
}

export function clearIncidents() {
  return { type: types.CLEAR_INCIDENTS };
}
