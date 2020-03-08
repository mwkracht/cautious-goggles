'use strict'

import { openGreatBuilding } from '../../../app/actions/greatBuilding';

let focusedGB = {};
const newFocusedGB = () => {
  return {
    name: null,             // stage_1
    currentLevel: null,     // stage_1
    fpRewards: [],          // stage_2
    fpToNextLevel: null,    // stage_1
    fpPlacedByOwner: null,  // stage_2
    fpPlacedByOthers: [],   // stage_2 
    ownerId: null,          // stage_1
    ownerName: null         // stage_2
  }
}

const greatBuildIDtoName = (id) => {
  const mapping = {
    X_AllAge_EasterBonus4: 'Observatory',
    X_AllAge_TODO1: 'Oracle of Delphi',
    X_AllAge_Expedition: 'Temple of Relics',
    X_BronzeAge_Landmark1: 'Tower of Babel',
    X_BronzeAge_Landmark2: 'Statue of Zeus',
    X_IronAge_Landmark1: 'Colosseum',
    X_IronAge_Landmark2: 'Lighthouse of Alexandria',
    X_EarlyMiddleAge_Landmark1: 'Hagia Sophia',
    X_EarlyMiddleAge_Landmark2: 'Cathedral of Aachen',
    X_HighMiddleAge_Landmark1: 'St. Mark\'s Basilica',
    X_HighMiddleAge_Landmark2: 'Notre Dame',
    X_LateMiddleAge_Landmark1: 'Saint Basil\'s Cathedral',
    X_LateMiddleAge_Landmark3: 'Castel del Monte',
    X_ColonialAge_Landmark1: 'Frauenkirche of Dresden',
    X_ColonialAge_Landmark2: 'Deal Castle',
    X_IndustrialAge_Landmark1: 'Royal Albert Hall',
    X_IndustrialAge_Landmark2: 'Capitol',
    X_ProgressiveEra_Landmark1: 'Alcatraz',
    X_ProgressiveEra_Landmark2: 'Château Frontenac',
    X_ModernEra_Landmark1: 'Space Needle',
    X_ModernEra_Landmark2: 'Atomium',
    X_PostModernEra_Landmark1: 'Cape Canaveral',
    X_PostModernEra_Landmark2: 'Habitat',
    X_ContemporaryEra_Landmark1: 'Lotus Temple',
    X_ContemporaryEra_Landmark2: 'Innovation Tower',
    X_TomorrowEra_Landmark1: 'Voyager V1',
    X_TomorrowEra_Landmark2: 'Dynamic Tower',
    X_FutureEra_Landmark1: 'Arc',
    X_FutureEra_Landmark2: 'Rain Forest Project',
    X_ArcticFuture_Landmark1: 'Gaea Statue',
    X_ArcticFuture_Landmark2: 'Arctic Orangery',
    X_ArcticFuture_Landmark3: 'Seed Vault',
    X_OceanicFuture_Landmark1: 'Atlantis Museum',
    X_OceanicFuture_Landmark2: 'Kraken',
    X_OceanicFuture_Landmark3: 'Blue Galaxy',
    X_VirtualFuture_Landmark1: 'Terracotta Army',
    X_VirtualFuture_Landmark2: 'Himeji Castle',
    X_SpaceAgeMars_Landmark1: 'Star Gazer',
    X_SpaceAgeMars_Landmark2: 'Virgo Project',
  }

  return mapping[id] || 'Unknown';
}


export function great_building_view_stage_1(data) {
  focusedGB = newFocusedGB();
  focusedGB.name = greatBuildIDtoName(data[0].cityentity_id);
  focusedGB.currentLevel = data[0].level;
  focusedGB.fpToNextLevel = data[0].state.forge_points_for_level_up;
  focusedGB.ownerId = data[0].player_id
}


export function great_building_view_stage_2(data) {
  for (let i = 0; i < data.rankings.length; i++) {
    if (data.rankings[i].player && data.rankings[i].player.player_id === focusedGB.ownerId) {
      focusedGB.fpPlacedByOwner = data.rankings[i].forge_points;
      focusedGB.ownerName = data.rankings[i].player.name;
    } else {
      if (typeof data.rankings[i].forge_points !== "undefined") {
        focusedGB.fpPlacedByOthers.push(data.rankings[i].forge_points);
      }
      if (typeof data.rankings[i].reward !== "undefined" ) {
        focusedGB.fpRewards.push(data.rankings[i].reward.strategy_point_amount || 0);
      }
    }
  }
  
  chrome.runtime.sendMessage({
    action: 'dispatch',
    args: openGreatBuilding(focusedGB)
  });
}


export function contribute_forge_points(data) {
  great_building_view_stage_2({rankings: data});
}
