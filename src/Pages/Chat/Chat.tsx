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
import {Props} from "../Home/Home";

const Chat: React.FunctionComponent<Props> = (props) => {
  console.log(props)
  const params: {id: string} = useParams()
  const socket = useRef(new WebSocket(config.socket_url))
  const token = localStorage.getItem('token')
  const {dispatch} = useUser()
  const isSubscribing = useSubscription([`user/${localStorage.getItem('user_id')}`]);
  // Function to bind socket and listen to it's actions
  const onSocketMessage = (event: any) => {
    const response = JSON.parse(event.data)
    console.dir(response)
    if (!response.data) {
      return
    }
    if (response.data.message === 'Successful connection') {
      console.warn(`Socket: Successful connection`)
    }
    if (response.action === 'new_message') {
      const message = response.data.message
      dispatch({type: 'ADD_MESSAGE', payload: message})
    }
  }
  if (params.id === undefined) {
    console.log('No chat')
    return <div className={'chat'}>
    <Sidebar {...props}/>
    </div>
  }
  if (isSubscribing) {
    return <Preloader />
  }

  return <div className={'chat'}>
      <Sidebar {...props}/>
      <DialogProvider>
        <Dialog {...props}/>
      </DialogProvider>
    </div>
}
export default Chat