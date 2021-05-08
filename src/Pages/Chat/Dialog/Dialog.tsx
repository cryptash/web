import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import Preloader from "../../../Components/Preloader/Preloader";
import Message from "./Message";
import './Dialog.scss'
import MessageInput from "./MessageInput";
import { useParams } from "react-router";
import { useDialog } from "../../../Contexts/DialogContext";
import DialogHeader from "./DialogHeader";
import { useUser } from "../../../Contexts/UserContext";

const Dialog: React.FunctionComponent<{socket: WebSocket}> = (props) => {
  const [isLoading, setLoading] = useState(true)
  let params: {id: string} = useParams()
  // const [id, setId] = useState('')
  const page = useRef(0)
  const prevScrollHeight = useRef(0)
  const [isRequested, setRequested] = useState(false)
  const dialog = useDialog()
  const user = useUser()
  const [msg, setMsg] = useState<Array<JSX.Element>>([])
  const messagesDiv = useRef<HTMLDivElement>(null)
  const callbacks = useRef<Array<Function>>([])
  const subcribeToScroll = (callback: Function) => {
    callbacks.current.push(callback)
    return () => callbacks.current.filter(x => x !== callback)
  }
  // useEffect(() => {
  //   console.log(params.id)
  //   setId(params.id)
  // }, [params.id]);

  const scrollCallback = (e: any) => {
    callbacks.current.forEach(callback => {
      callback(e)
    });
    if (e.target.scrollTop === 0) {
      if (!isRequested) {
        page.current = page.current + 1
        prevScrollHeight.current = messagesDiv.current? messagesDiv.current.scrollHeight : 0
        setRequested(true)
        props.socket.send(
          JSON.stringify({
            action: 'get_messages',
            chat_id: params.id,
            pg: page.current,
            jwt: localStorage.getItem('token'),
          })
        )
      }
    }
  }
  const callback = useCallback((ev: MessageEvent<any>, id) => {
    const response = JSON.parse(ev.data)
    if (response.action === 'get_messages') {
      if (page.current === 0) {
        dialog.dispatch({type: 'CHANGE_DIALOG'})
        callbacks.current = []
        dialog.dispatch({type: 'CHANGE_KEY', payload: response.pub_key})
        dialog.dispatch({type: 'ADD_MESSAGE', payload: response.messages})
      }
      else {
        if (response.messages[0]) {
          dialog.dispatch({type: 'ADD_MORE_MESSAGES', payload: response.messages})
          setRequested(false)
        } 
      }
      setLoading(false)
    }
    if (response.action === 'new_message') {
      console.log(response.data.message.chat_id, id)
      if (response.data.message.chat_id === id) {
        dialog.dispatch({type: 'ADD_MESSAGE', payload: [{
          content: response.data.message.content,
          pub_key: dialog.state.pub_key,
          date: response.data.message.date,
          fromMe: response.data.message.isMe,
          read: response.data.message.read,
          message_id: response.data.message.message_id
        }]})
      }
    }
    if (response.action === 'message_read_by_user') {
      if (response.data.chat_id === id)
        dialog.dispatch({type: 'SET_MESSAGE_READ_STATUS', payload: {
          id: response.data.message_id
        }})
    }
  }, [dialog.state.user_id])
  useEffect(() => {
    const msgComp: Array<JSX.Element> = []
    dialog.state.messages.forEach((m: {
      content: string,
      fromMe: boolean,
      date: Date,
      read: boolean,
      message_id: string
  }) => {
      return msgComp.push(<Message socket={props.socket} id={m.message_id} subscribeToScroll={(c: Function) => subcribeToScroll(c)} isRead={m.read} content={m.content} pub_key={dialog.state.pub_key} key={nanoid(6)} fromMe={m.fromMe} date={m.date} />)
  });
    setMsg(msgComp)
  },[dialog.state])
  useEffect(() => {
    if (messagesDiv.current && (messagesDiv.current.scrollTop > 1000 || page.current === 0))
      messagesDiv.current.scrollTo(0,messagesDiv.current ? messagesDiv.current.scrollHeight : 0);
    else if (messagesDiv.current)
      messagesDiv.current.scrollTo(0,messagesDiv.current ? messagesDiv.current.scrollHeight - prevScrollHeight.current : 0);
  }, [msg])
  useEffect(() => {
    const _ = (ev: MessageEvent) => callback(ev, params.id)
    props.socket.addEventListener('message', _)
    dialog.dispatch({type: 'CHANGE_DIALOG'})
    page.current = 0
    setLoading(true)
    props.socket.send(
      JSON.stringify({
        action: 'get_messages',
        chat_id: params.id,
        pg: 0,
        jwt: localStorage.getItem('token'),
      })
    )
    return () => {
      // props.socket.removeEventListener('open', onOpenCallback)
      props.socket.removeEventListener('message', _)
    }
  }, [callback, params.id, props.socket])
  if (!params.id) {
    return <div></div>
  }
  if (isLoading) return <div className={'preloader'}><Preloader /></div>
  return <>
    <div className={'chat_dialog'}>
      <DialogHeader socket={props.socket} />
      <div className={'chat_dialog__messages'} onScroll={(e) => scrollCallback(e)} ref={messagesDiv}>{msg}</div>
      <MessageInput socket={props.socket} chat_id={params.id}/>
    </div>
  </>
}
export default Dialog