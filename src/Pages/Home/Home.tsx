import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Preloader from '../../Components/Preloader/Preloader'
import config from '../../config'
import Chat from '../Chat/Chat'
import { Client } from '@logux/client'
import store from '../../Logux/store'
import { Provider } from 'react-redux'

const Home = () => {
  const [isLoggined, setLoginned] = useState(0)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const signOut = () => {
    navigate('/login')
    setLoginned(1)
    localStorage.removeItem('key')
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
  }
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
          signOut()
        }
      })
      client.start()
      client.log.add(
        { type: 'user/check', token: localStorage.getItem('token') },
        { sync: true }
      )
    } else {
      signOut()
    }
  }, [token])

  if (isLoggined === 0) {
    return <Preloader />
  }

  if (isLoggined === 1) {
    return <Navigate to={'/login'} />
  }
  return (
    <Provider store={store}>
      <Chat />
    </Provider>
  )
}

export default Home
