import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import Preloader from "../../../Components/Preloader/Preloader";
import { ChatResponse } from "../../../Typings/ChatReponse";
import Chat from "../Chat";
import Message from "./Message";
import './Dialog.scss'
import { preProcessFile } from "typescript";

const Dialog: React.FunctionComponent<{chat: ChatResponse, username: string, pub_key: string, socket: WebSocket, picture: string}> = (props) => {
  const Messages: Array<React.FunctionComponentElement<{
    content: string
    pub_key: string
    key: string
    date: Date
    fromMe: boolean
  }>> = []
  const initialState: Array<{
    content: string
    pub_key: string
    date: Date
    fromMe: boolean
  }> = []
  const [isLoading, setLoading] = useState(true)
  const [msg, setMsg] = useState(initialState)
  const [children, setChildren] = useState(Messages)
  const callback = (ev: MessageEvent<any>) => {
    console.log(ev)
    const response = JSON.parse(ev.data)
    if (response.action === 'get_messages') {
      setMsg(response.messages)
      setLoading(false)
    }
  }
  useEffect(() => {
    setLoading(true)
    if (props.chat) {
      if (props.socket.readyState === 0) {
        props.socket.onopen = () => {
          props.socket.send(
            JSON.stringify({
              action: 'get_messages',
              chat_id: props.chat.chat_id,
              pg: 0,
              jwt: localStorage.getItem('token'),
            })
          )
        }
      }
      else {
        props.socket.send(
          JSON.stringify({
            action: 'get_messages',
            chat_id: props.chat.chat_id,
            pg: 0,
            jwt: localStorage.getItem('token'),
          })
        )
      }
    } 
    
  }, [props.chat, props.socket])
  props.socket.addEventListener('message', callback)
  msg.forEach((m) => {
    Messages.push(<Message content={m.content} pub_key={props.chat.user.pub_key} key={nanoid(6)} fromMe={m.fromMe} date={m.date} />)
  })
  if (!props.chat) {
    return <div>
      
    </div>
  }
  if (isLoading) return <Preloader />
  return <>
    <div>{Messages}</div>
  </>
}
export default Dialog