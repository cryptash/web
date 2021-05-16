import Sidebar from "./Sidebar/Sidebar"
import './Chat.scss'
import config from '../../config'
import React, {useEffect, useRef, useState } from "react"
import Preloader from '../../Components/Preloader/Preloader'
import { useParams } from "react-router-dom"
import Dialog from "./Dialog/Dialog"
import { useUser} from '../../Contexts/UserContext'
import { DialogProvider } from "../../Contexts/DialogContext"
import {useSubscription} from "@logux/redux";
import store from "../../Logux/store";
import {badge} from "@logux/client";
import {badgeStyles} from "@logux/client/badge/styles";
import {connector, Props} from "../../Logux/connect";
import {Provider} from "react-redux";
const Chat: React.FunctionComponent<Props> = (props) => {
  const params: {id: string} = useParams()
  const isSubscribing = useSubscription([`user/${localStorage.getItem('user_id')}`]);
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
        <Sidebar/>
        <DialogProvider>
          <Dialog/>
        </DialogProvider>
      </div>
    </Provider>
  )
}
export default connector(Chat)