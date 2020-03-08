'use strict'
import 'datejs';
import { addMotivation } from '../../../app/actions/motivations';

const MOTIVATION_TYPES = ['motivate', 'polish', 'polivate_failed'];

export function new_page(data) {
  for (let i = 0; i < data.events.length; i++) {
    if ( MOTIVATION_TYPES.includes(data.events[i].interaction_type) ) {
      function convertTimeString(time) {
        var [date, time] = time.split(' at ');

        const date_map = {
          today: Date.today(),
          yesterday: Date.today().add(-1).day(),
          Monday: Date.today().last().monday(),
          Tuesday: Date.today().last().tuesday(),
          Wednesday: Date.today().last().wednesday(),
          Thursday: Date.today().last().thursday(),
          Friday: Date.today().last().friday(),
          Saturday: Date.today().last().saturday(),
          Sunday: Date.today().last().sunday(),
        }

        return date_map[date].at(time);
      };

      chrome.runtime.sendMessage({
        action: 'dispatch',
        args: addMotivation({
          id: data.events[i].id,
          time: convertTimeString(data.events[i].date),
          player: data.events[i].other_player.name,
          playerId: data.events[i].other_player.player_id,
          isFriend: data.events[i].other_player.is_friend,
          isNeighbor: data.events[i].other_player.is_neighbor,
          isGuildMember: data.events[i].other_player.is_guild_member,
          type: data.events[i].interaction_type
        })
      });    
    }
  }
}