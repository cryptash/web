import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import Preloader from "../../../Components/Preloader/Preloader";
import Message from "./Message";
import './Dialog.scss'
import MessageInput from "./MessageInput";
import { useParams } from "react-router";
import { useDialog } from "../../../Contexts/DialogContext";
import DialogHeader from "./DialogHeader";
import {useDispatch, useSubscription} from "@logux/redux";
import {useSelector} from "react-redux";
import {getMessages, RootState} from "../../../Reducers";
import store from "../../../Logux/store";
import {connector, Props} from "../../../Logux/connect";

const Dialog: React.FunctionComponent<Props> = (props) => {
  let params: {id: string} = useParams()
  const dispatch = useDispatch()
  const page = useRef(0)
  const prevScrollHeight = useRef(0)
  const [isRequested, setRequested] = useState(false)
  const dialog = useDialog()
  const isSubscribing = useSubscription([`chat/${params.id}`]);
  const chat = useSelector((state: RootState) => state.chatReducer)
  const [msg, setMsg] = useState<Array<JSX.Element>>([])
  const messagesDiv = useRef<HTMLDivElement>(null)
  const callbacks = useRef<Array<Function>>([])
  const subcribeToScroll = (callback: Function) => {
    callbacks.current.push(callback)
    return () => callbacks.current.filter(x => x !== callback)
  }
  useEffect(() => {
    props.setChatId(params.id)
  }, []);

  useEffect(() => {
    props.changeChat(params.id)
  }, [params.id]);

  const scrollCallback = (e: any) => {
    callbacks.current.forEach(callback => {
      callback(e)
    });
    if (e.target.scrollTop === 0) {
      if (!isRequested) {
        page.current = page.current + 1
        prevScrollHeight.current = messagesDiv.current? messagesDiv.current.scrollHeight : 0
        setRequested(true)
        dispatch.sync(getMessages({pg: page.current, chat_id: params.id})).then(() => setRequested(false))
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
    store.subscribe(() => {
      let c = store.getState().chatReducer
      const msgComp: Array<JSX.Element> = []
      c.messages.forEach((m: {
        content: string,
        fromMe: boolean,
        date: Date,
        read: boolean,
        message_id: string
      }) => {
        return msgComp.push(<Message socket={props.socket} id={m.message_id} subscribeToScroll={(c: Function) => subcribeToScroll(c)} isRead={m.read} content={m.content} pub_key={props.chat.pub_key} key={m.message_id} fromMe={m.fromMe} date={m.date} />)
      });
      setMsg(msgComp)
    })
    const msgComp: Array<JSX.Element> = []
    chat.messages.forEach((m: {
      content: string,
      fromMe: boolean,
      date: Date,
      read: boolean,
      message_id: string
  }) => {
      return msgComp.push(<Message socket={props.socket} id={m.message_id} subscribeToScroll={(c: Function) => subcribeToScroll(c)} isRead={m.read} content={m.content} pub_key={props.chat.pub_key} key={nanoid(6)} fromMe={m.fromMe} date={m.date} />)
  });
    setMsg(msgComp)
  },[chat])
  useEffect(() => {
    if (messagesDiv.current && (messagesDiv.current.scrollTop > 1000 || page.current === 0)){
      messagesDiv.current.scrollTo(0,messagesDiv.current ? messagesDiv.current.scrollHeight : 0)
    }
    else if (messagesDiv.current)
      messagesDiv.current.scrollTo(0,messagesDiv.current ? messagesDiv.current.scrollHeight - prevScrollHeight.current : 0);
  }, [msg, isSubscribing])
  if (!params.id) {
    return <div></div>
  }
  if (isSubscribing) return <div className={'preloader'}><Preloader /></div>
  return <>
    <div className={'chat_dialog'}>
      <DialogHeader socket={props.socket} />
      <div className={'chat_dialog__messages'} onScroll={(e) => scrollCallback(e)} ref={messagesDiv}>{msg}</div>
      <MessageInput {...props}/>
    </div>
  </>
}
export default connector(Dialog)