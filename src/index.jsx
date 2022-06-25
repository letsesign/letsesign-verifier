/* eslint-disable import/no-import-module-exports */

import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';

import 'styles/global.scss';

import App from './App';

const MOUNT_NODE = document.getElementById('root');
const history = createHashHistory();
const render = () => {
  ReactDOM.render(<App history={history} />, MOUNT_NODE);
};

if (module.hot) {
  module.hot.accept('App', () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}

render();
