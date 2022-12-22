import Sidebar from './Sidebar/Sidebar'
import './Chat.scss'
import React, { useEffect } from 'react'
import Preloader from '../../Components/Preloader/Preloader'
import { useParams } from 'react-router-dom'
import Dialog from './Dialog/Dialog'
import { DialogProvider } from '../../Contexts/DialogContext'
import { useSubscription } from '@logux/redux'
import store from '../../Logux/store'
import { Provider } from 'react-redux'
import { badge } from '@logux/client'
import { badgeStyles } from '@logux/client/badge/styles'

const Chat: React.FunctionComponent = () => {
  const params = useParams()
  const isSubscribing = useSubscription([
    `user/${localStorage.getItem('user_id')}`
  ])
  useEffect(() => {
    if (!isSubscribing) 
      badge(store.client, {
        messages: {
          synchronized: 'Everything is up to date',
          disconnected: 'No connection to server.',
          wait: 'Sending...',
          sending: 'Sending...',
          error: 'Error occurred. Please, try again!',
          protocolError: 'Error occurred. Please, contact admins!',
          syncError: 'Error while syncing...',
          denied: 'Access denied'
        },
        styles: badgeStyles
      })
  }, [isSubscribing])
  if (params.id === undefined) {
    console.log('No chat')
    return (
      <Provider store={store}>
        <div className={'chat'}>
          <Sidebar />
        </div>
      </Provider>
    )
  }

  if (isSubscribing) {
    return <Preloader />
  }

  return (
    <Provider store={store}>
      <div className={'chat'}>
        <Sidebar />
        <DialogProvider>
          <Dialog />
        </DialogProvider>
      </div>
    </Provider>
  )
}
export default Chat
