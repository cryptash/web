import Sidebar from './Sidebar/Sidebar'
import './Chat.scss'
import React from 'react'
import Preloader from '../../Components/Preloader/Preloader'
import { useParams } from 'react-router-dom'
import Dialog from './Dialog/Dialog'
import { DialogProvider } from '../../Contexts/DialogContext'
import { useSubscription } from '@logux/redux'
import store from '../../Logux/store'
import { Provider } from 'react-redux'
const Chat: React.FunctionComponent = () => {
  const params: { id: string } = useParams()
  const isSubscribing = useSubscription([
    `user/${localStorage.getItem('user_id')}`
  ])
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
