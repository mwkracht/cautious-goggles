import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './foe_tools.css';
import createStore from '../../app/store/configureStore';

var store;

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.action) {
      case 'dispatch':
        store.dispatch(request.args);
        break;
    }
  }
);


chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');
  store = createStore(initialState)

  ReactDOM.render(
    <Root store={store} />,
    document.querySelector('#root')
  );
});
