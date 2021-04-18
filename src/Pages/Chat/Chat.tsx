import Sidebar from "./Sidebar/Sidebar"
import './Chat.scss'
import config from '../../config'
import React, {useEffect, useRef, useState } from "react"
import Preloader from '../../Components/Preloader/Preloader'
import { useParams } from "react-router-dom"
import Dialog from "./Dialog/Dialog"
import { useUser} from '../../Contexts/UserContext'
import { DialogProvider } from "../../Contexts/DialogContext"

const Chat = () => {
  const params: {id: string} = useParams()
  const socket = useRef(new WebSocket(config.socket_url))
  const token = localStorage.getItem('token')
  const {dispatch} = useUser()
  const [isLoading, setLoading] = useState(true)

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
  const bindSocket = () => {
    socket.current.onopen = () => {
      socket.current.send(
          JSON.stringify({action: 'register', jwt: token})
      )
    }
    socket.current.addEventListener('message', onSocketMessage)
  }
  const fetchData = () => {
    fetch(config.server_url + 'api/users/getInfo', {
      method: 'POST',
      mode: 'cors',
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
            const rsp = res.response
            dispatch({type: 'CHANGE_USER', payload: {...rsp}})
            setLoading(false)
          }
        })
  }
  useEffect(() => {
    bindSocket()
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => socket.current.removeEventListener('message', onSocketMessage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (params.id === undefined) {
    console.log('No chat')
    return <div className={'chat'}>
    <Sidebar />
    </div>
  }
  if (isLoading) {
    return <Preloader />
  }

  return <div className={'chat'}>
      <Sidebar/>
      <DialogProvider>
        <Dialog socket={socket.current}/> 
      </DialogProvider>
    </div>
}
export default Chat