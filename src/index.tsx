import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import { ScreenProvider } from './Contexts/ScreenContext';
import { Provider } from 'react-redux';
import store from './Logux/store'
import { badge, badgeEn } from '@logux/client'
import { badgeStyles } from '@logux/client/badge/styles'
store.client.start()
badge(store.client, {messages: {
    synchronized: 'Sent all unsent messages.',
    disconnected: 'No connection to server.',
    wait: 'Waiting...',
    sending: 'Sending...',
    error: 'Error occurred. Please, try again!',
    protocolError: 'Error occurred. Please, contact admins!',
    syncError: 'Error while syncing...',
    denied: 'Access denied'
  }, styles: badgeStyles })
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ScreenProvider>
        <BrowserRouter>
          <App>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register}/>
            <Route path={['/:id', '/']} exact component={Home} />
          </App>
        </BrowserRouter>
      </ScreenProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
