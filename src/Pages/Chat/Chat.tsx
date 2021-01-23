import Sidebar from "./Sidebar/Sidebar"
import './Chat.scss'
import config from '../../config'
import React, { useEffect, useState } from "react"
import {UserState} from '../../Typings/UserState'
import { ChatResponse } from "../../Typings/ChatReponse"
import Preloader from '../../Components/Preloader/Preloader'
import { useParams } from "react-router-dom"
import Dialog from "./Dialog/Dialog"
const Chat = () => {
  const params: {id: string} = useParams()
  const socket = new WebSocket(config.socket_url)
  const token = localStorage.getItem('token')
  const initialState: UserState = {
    username: '',
    user_id: '',
    picture: '',
    pub_key: '',
    chats: [],
  }
  const [isLoading, setLoading] = useState(true)
  const [user, setUserState] = useState(initialState)
  const setUser = (newUser: {
    username?: string
    user_id?: string
    picture?: string
    chats?: Array<ChatResponse>
  }) => {
    //@ts-ignore
    setUserState({...user, ...newUser})
  }
  // Function to bind socket and listen to it's actions
  const bindSocket = () => {
    socket.onopen = () => {
      socket.send(
          JSON.stringify({action: 'register', jwt: token})
      )
    }
    socket.addEventListener('message', (event: any) => {
      const response = JSON.parse(event.data)
      // console.dir(response)
      if (!response.data) {
        return
      }
      if (response.data.message === 'Successful connection') {
        console.warn(`Socket: Successful connection`)
      }
    })
  }
  const fetchData = () => {
    fetch(config.server_url + 'api/users/getInfo', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Authorization': token ? token : '',
        'Content-Type': 'application/json',
      },
    })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode !== 200) {
            console.error(res)
          } else {
            setUserState(res.response)
            setLoading(false)
            console.dir(user)
          }
        })
  }
  useEffect(() => {
    bindSocket()
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(params.id)
  if (params.id === undefined) {
    console.log('No chat')
    return <div className={'chat'}>
    <Sidebar user={user}/>
  </div>
  }
  if (isLoading) {
    return <Preloader />
  }
  return <>
    <div className={'chat'}>
      <Sidebar user={user}/>
      <Dialog chat={user.chats.filter(e => e.chat_id === params.id)[0]} username={user.username} pub_key={user.pub_key} socket={socket} picture={user.picture}/>
    </div>
  </>
}
export default Chat