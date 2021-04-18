import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// @ts-ignore
import {BrowserRouter, Route, Link} from 'react-router-dom';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/register' component={Register}/>
        <Route path={['/:id', '/']} exact component={Home} />
      </App>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
