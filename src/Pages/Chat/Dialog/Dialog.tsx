import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import Preloader from "../../../Components/Preloader/Preloader";
import Message from "./Message";
import './Dialog.scss'
import MessageInput from "./MessageInput";
import { useParams } from "react-router";
import { useUser } from "../../../Contexts/UserContext";
import { useDialog } from "../../../Contexts/DialogContext";

const Dialog: React.FunctionComponent<{socket: WebSocket}> = (props) => {
  const [isLoading, setLoading] = useState(true)
  const [pub_key, setKey] = useState('')
  const params: {id: string} = useParams()
  const user = useUser()
  const dialog = useDialog()
  const [msg, setMsg] = useState<Array<JSX.Element>>([])
  const messagesDiv = useRef<HTMLDivElement>(null)
  // const scrollCallback = 
  const callback = useCallback((ev: MessageEvent<any>) => {
    const response = JSON.parse(ev.data)
    if (response.action === 'get_messages') {
      dialog.dispatch({type: 'CHANGE_DIALOG'})
      dialog.dispatch({type: 'CHANGE_KEY', payload: response.pub_key})
      dialog.dispatch({type: 'ADD_MESSAGE', payload: response.messages})
      setLoading(false)
    }
    if (response.action === 'new_message') {
      console.log('NEW')
      if (response.data.message.chat_id === params.id)
        dialog.dispatch({type: 'ADD_MESSAGE', payload: [{
          content: response.data.message.content,
          pub_key: dialog.state.pub_key,
          date: response.data.message.date,
          fromMe: response.data.message.isMe
        }]})
    }
  }, [dialog.state.user_id])
  useEffect(() => {
    console.log('À')
    const msgComp: Array<JSX.Element> = []
    dialog.state.messages.forEach((m: {
      content: string,
      fromMe: boolean,
      date: Date
  }) => {
      return msgComp.push(<Message content={m.content} pub_key={dialog.state.pub_key} key={nanoid(6)} fromMe={m.fromMe} date={m.date} />)
  });
    setMsg(msgComp)
  },[dialog.state])
  useEffect(() => {
    console.log('scroll')
    if (messagesDiv.current)
      messagesDiv.current.scrollTo(0,messagesDiv.current ? messagesDiv.current.scrollHeight : 0);
  }, [msg])
  useEffect(() => {
    props.socket.addEventListener('message', callback)
    dialog.dispatch({type: 'CHANGE_DIALOG'})
    setLoading(true)
    props.socket.send(
      JSON.stringify({
        action: 'get_messages',
        chat_id: params.id,
        pg: 0,
        jwt: localStorage.getItem('token'),
      })
    )
    // const onOpenCallback = () => {
    //   props.socket.send(
    //     JSON.stringify({
    //       action: 'get_messages',
    //       chat_id: params.id,
    //       pg: 0,
    //       jwt: localStorage.getItem('token'),
    //     })
    //   )
    // }
    // if (params.id) {
    //   if (props.socket.readyState === 0) {
    //     props.socket.onopen = onOpenCallback
    //   }
    //   else {
        
    // }
    return () => {
      // props.socket.removeEventListener('open', onOpenCallback)
      props.socket.removeEventListener('message', callback)
    }
  }, [callback, params.id, props.socket])
  console.log(dialog.state)
  if (!params.id) {
    return <div></div>
  }
  if (isLoading) return <div className={'preloader'}><Preloader /></div>
  console.log(dialog.state.messages)
  return <>
    <div className={'chat_dialog'}>{console.log(msg)}
      <div className={'chat_dialog__messages'} ref={messagesDiv}>{msg}</div>
      <MessageInput socket={props.socket} chat_id={params.id}/>
    </div>
  </>
}
export default Dialog