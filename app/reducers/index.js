import { combineReducers } from 'redux';
import incidents from './incidents';
import greatBuilding from './greatBuilding';
import motivations from './motivations';

export default combineReducers({
  incidents,
  greatBuilding,
  motivations,
});
