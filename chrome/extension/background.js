'use strict';
const cityMap = require('./background/city_map');
const eventHistory = require('./background/event_history');
const greatBuildings = require('./background/great_buildings');


chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostContains: 'forgeofempires.com',
          pathEquals: '/game/index'
        }
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});


chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    for (let i = 0; i < request.respData.length; i++) {
      const response = request.respData[i]
      switch (response.requestClass) {
        case 'CityMapService':
          switch(response.requestMethod) {
            case 'updateEntity':
              greatBuildings.great_building_view_stage_1(response.responseData);
              break;
          }
          break;
        case 'GreatBuildingsService':
          switch(response.requestMethod) {
            case 'getConstruction':
              greatBuildings.great_building_view_stage_2(response.responseData);
              break;
            case 'contributeForgePoints':
              greatBuildings.contribute_forge_points(response.responseData);
              break;
          }
          break;
        case 'OtherPlayerService':
          switch(response.requestMethod) {
            case 'getEventsPaginated':
              eventHistory.new_page(response.responseData);
              break;
          }
          break;
        case 'HiddenRewardService':
          switch(response.requestMethod) {
            case 'getOverview':
              cityMap.newIncidents(response.responseData);
              break;
          }
      }
    }
  }
);


chrome.pageAction.onClicked.addListener(function () {
  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'panel',
    width: 320,
    height: 800,
  });
});
