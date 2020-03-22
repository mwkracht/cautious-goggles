'use strict'
import { addIncident, clearIncidents } from '../../../app/actions/cityMap';


export function newIncidents(data) {
  // Any time the game loads or an incident is collected the server responds with a full
  // list of incidents (some may be new some may be known). Either way clear all current
  // incidents and refresh with latest list
  chrome.runtime.sendMessage({
    action: 'dispatch',
    args: clearIncidents()
  });

  for (let i = 0; i < data.hiddenRewards.length; i++) {
    chrome.runtime.sendMessage({
      action: 'dispatch',
      args: addIncident({
        id: data.hiddenRewards[i].hiddenRewardId,
        startTime: data.hiddenRewards[i].startTime,
        endTime: data.hiddenRewards[i].expireTime,
        rarity: data.hiddenRewards[i].rarity,
        locationHint: data.hiddenRewards[i].position.context
      })
    });
  }
}