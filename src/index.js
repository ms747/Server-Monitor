import React from 'react';
import ReactDOM from 'react-dom';
import { socketStore, socketContext } from 'reactjs-socket.io';
import App from './App';
import * as serviceWorker from './serviceWorker';
const { Provider } = socketContext;
const host = socketStore("ws://localhost:3000")


ReactDOM.render(<Provider value={host}><App /></Provider>, document.getElementById('root'));

serviceWorker.unregister();
