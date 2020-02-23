import * as types from '../constants/ActionTypes';

export function openGreatBuilding(greatBuilding) {
  return { type: types.OPEN_GB, greatBuilding };
}
