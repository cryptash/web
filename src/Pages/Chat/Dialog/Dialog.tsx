import {FunctionComponent, useEffect, useRef, useState} from "react";
import Preloader from "../../../Components/Preloader/Preloader";
import './Dialog.scss'
import MessageInput from "./MessageInput";
import { useParams } from "react-router";
import DialogHeader from "./DialogHeader";
import {useDispatch, useSubscription} from "@logux/redux";
import {useSelector} from "react-redux";
import {changeChat, getMessages, RootState, setChatId} from "../../../Reducers";
import store from "../../../Logux/store";
import {connector} from "../../../Logux/connect";
import Message from "./Message";

const Dialog: FunctionComponent = () => {
  let params: {id: string} = useParams()
  const dispatch = useDispatch()
  const page = useRef(0)
  const prevScrollHeight = useRef(0)
  const [isRequested, setRequested] = useState(false)
  const isSubscribing = useSubscription([`chat/${params.id}`]);
  const chat = useSelector((state: RootState) => state.chatReducer)
  const [msg, setMsg] = useState<Array<JSX.Element>>([])
  const messagesDiv = useRef<HTMLDivElement>(null)
  const callbacks = useRef<Array<Function>>([])
  const subscribeToScroll = (callback: Function) => {
    callbacks.current.push(callback)
    return () => callbacks.current.filter(x => x !== callback)
  }
  useEffect(() => {
    dispatch(setChatId({id: params.id}))
  }, [dispatch, params.id]);

  useEffect(() => {
    dispatch(changeChat({id: params.id}))
  }, [dispatch, params.id]);

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
  useEffect(() => {
    const renderMessages = (messages: {
      content: string,
      fromMe: boolean,
      date: Date,
      read: boolean,
      message_id: string
    }[]) => {
      console.log('render messages', messages)
      const msgComp: Array<JSX.Element> = []
      messages.forEach((m: {
        content: string,
        fromMe: boolean,
        date: Date,
        read: boolean,
        message_id: string
      }) => {
        return msgComp.push(<Message id={m.message_id} subscribeToScroll={(c: Function) => subscribeToScroll(c)} isRead={m.read} content={m.content} pub_key={chat.pub_key} key={m.message_id} fromMe={m.fromMe} date={m.date} />)
      });
      setMsg(msgComp)
      return msgComp
    }
    store.subscribe(() => {
      let c = store.getState().chatReducer
      renderMessages(c.messages)
    })
  },[chat.pub_key])
  useEffect(() => {
    if (messagesDiv.current && (messagesDiv.current.scrollTop > 1000 || page.current === 0)){
      messagesDiv.current.scrollTo(0,messagesDiv.current ? messagesDiv.current.scrollHeight : 0)
    }
    else if (messagesDiv.current)
      messagesDiv.current.scrollTo(0,messagesDiv.current ? messagesDiv.current.scrollHeight - prevScrollHeight.current : 0);
  }, [msg, isSubscribing])
  if (!params.id) {
    return <div>No chat!</div>
  }
  if (isSubscribing) return <div className={'preloader'}><Preloader /></div>
  return <>
    <div className={'chat_dialog'}>
      <DialogHeader username={chat.username} picture={chat.picture}/>
      <div className={'chat_dialog__messages'} onScroll={(e) => scrollCallback(e)} ref={messagesDiv}>{msg}</div>
      <MessageInput />
    </div>
  </>
}
export default connector(Dialog)