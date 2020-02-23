'use strict';
// https://stackoverflow.com/questions/8939467/chrome-extension-to-read-http-response

var s = document.createElement('script');
s.src = chrome.extension.getURL('js/listener/listener.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
