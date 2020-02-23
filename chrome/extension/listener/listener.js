'use strict';
// https://stackoverflow.com/questions/8939467/chrome-extension-to-read-http-response
// https://github.com/veger/foei/blob/16ff531e1ee26d81a57b65559a2fc1f4572b183b/ajax_inspect.js

(function(xhr) {
  let match = RegExp('extension:\\/\\/([^\\/]*)').exec(document.currentScript.src)
  let extensionID = match[1]

  var XHR = XMLHttpRequest.prototype;

  var open = XHR.open;
  var send = XHR.send;
  var setRequestHeader = XHR.setRequestHeader;

  // Collect data for processing in send method
  XHR.open = function(method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = (new Date()).toISOString();

    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function(header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function(postData) {
    this.addEventListener('load', function() {
      if (this._url.includes('forgeofempires.com/game/json')) {
        let postDataJSON = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(postData)));
        let respDataJSON = JSON.parse(this.responseText);

        let gameData = {
          postData: postDataJSON,
          respData: respDataJSON,
        };

        chrome.runtime.sendMessage(extensionID, gameData)
      };
    });
    return send.apply(this, arguments);
  };

})(XMLHttpRequest);
