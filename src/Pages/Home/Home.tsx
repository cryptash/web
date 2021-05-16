import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import Preloader from "../../Components/Preloader/Preloader";
import config from '../../config'
import { UserProvider } from '../../Contexts/UserContext';
import Chat from '../Chat/Chat';
import {badge, Client} from "@logux/client";
import store from "../../Logux/store";
import {badgeStyles} from "@logux/client/badge/styles";
import {Provider} from "react-redux";
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

const Home= () => {
  const [isLoggined, setLoginned] = useState(0)
  const token = localStorage.getItem('token')
  // Check if authenticated
  useEffect(() => {
    if (localStorage.getItem('token')) {
      let client = new Client({
        subprotocol: '1.0.0',
        server: config.socket_url,
        userId: 'anonymous'
      })
      client.on('add', (action: any) => {
        if (action.type === 'user/check/done') {
          store.client.start()
          setLoginned(2)
        } else if (action.type === 'logux/undo') {
          setLoginned(0)
        }
      })
      client.start()
      client.log.add({ type: 'user/check', token: localStorage.getItem('token')}, { sync: true })
    } else {
      setLoginned(1)
    }
  }, [token])

  if (isLoggined === 0) {
    return <Preloader />
  }

  if (isLoggined === 1) {
    return <Redirect to={'/login'}/>
  }
  return (<Provider store={store}>
    <Chat/>
  </Provider>
  )
  
}

export default Home;
