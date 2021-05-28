import {FunctionComponent, useEffect, useRef, useState} from "react";
import Preloader from "../../../Components/Preloader/Preloader";
import './Dialog.scss'
import MessageInput from "./MessageInput";
import { useParams } from "react-router";
import DialogHeader from "./DialogHeader";
import {useDispatch, useSubscription} from "@logux/redux";
import {connect, useSelector} from "react-redux";
import {changeChat, getMessages, RootState, setChatId} from "../../../Reducers";
import store from "../../../Logux/store";
import Message from "./Message";
import * as MessageTyping from "../../../Typings/Message";
import {nanoid} from "nanoid";
const Dialog: FunctionComponent<{
  chat_id:string
}> = (props) => {
  let params: {id: string} = useParams()
  const dispatch = useDispatch()
  const page = useRef(0)
  const prevScrollHeight = useRef(0)
  const [isRequested, setRequested] = useState(false)
  const isSubscribing = useSubscription(props.chat_id ? [`chat/${props.chat_id}`] : []);
  let chat = useSelector((state: RootState) => state.chatReducer)
  const [msg, setMsg] = useState<Array<JSX.Element>>([])
  const messagesDiv = useRef<HTMLDivElement>(null)
  const messages = useRef<Array<JSX.Element>>([])
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
        prevScrollHeight.current = messagesDiv.current ? messagesDiv.current.scrollHeight : 0
        setRequested(true)
        dispatch.sync(getMessages({pg: page.current, chat_id: params.id})).then(() => setRequested(false))
      }
    }
  }
  const setMessages = (n: Array<JSX.Element>, isNew?: boolean) => {
    if (isNew) messages.current = [...messages.current, ...n]
    else messages.current = [...n, ...messages.current]
    prevScrollHeight.current = messagesDiv.current ? messagesDiv.current.scrollHeight : 0
  }
  const renderMessages = (messages: {
    content: string,
    fromMe: boolean,
    date: Date,
    read: boolean,
    message_id: string
  }[]) => {
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
    return msgComp
  }
  useEffect(() => {
    const listener = store.client.log.type('chat/load_messages/done', (action: {
      type: 'chat/load_messages/done',
      payload: {
        messages: MessageTyping.Message[]
      }
    }, meta) => {
      if (action.payload.messages[0]) {
        const messages = renderMessages(action.payload.messages)
        setMessages(messages)
      }
    })
    return listener
  },[renderMessages, chat.pub_key])
  useEffect(() => {
    const listener = store.client.log.type('chat/message/create', (action: {
      type: 'chat/message/create',
      payload: {
        from: string
        message_id: string
        content: string
        date: Date
        chat_id: string
        read: boolean
      }
    }, meta) => {
      if (chat.chat_id === action.payload.chat_id && action.payload.from !== localStorage.getItem('user_id')) {
        console.log(action)
        if (!store.getState().chatReducer.messages.filter((m: MessageTyping.Message) => action.payload.message_id === m.message_id)[0]) {
          setMessages([
            <Message id={action.payload.message_id} subscribeToScroll={(c: Function) => subscribeToScroll(c)} isRead={action.payload.read} content={action.payload.content} pub_key={chat.pub_key} key={action.payload.message_id} fromMe={action.payload.from === localStorage.getItem('user_id')} date={action.payload.date} />
          ],
            true
          )
        }
      }
    })
    return listener
  },[chat.chat_id, chat.pub_key])
  useEffect(() => {
    const listener = store.client.log.type('chat/messages/send', (action: {
      type: 'chat/messages/send'
      payload: {
        content: string
      }
    }, meta) => {
      setMessages([ <Message id={''} subscribeToScroll={(c: Function) => subscribeToScroll(c)} isRead={false} content={action.payload.content} pub_key={chat.pub_key} key={nanoid(6)} fromMe={true} date={new Date()} />], true)
      scrollDown()
    })
    return listener
  },[chat.chat_id, chat.pub_key])


  useEffect(() => {
    messages.current = []
  }, [props.chat_id]);


  const scrollDown = () => {
    if (messagesDiv.current && messagesDiv.current.scrollTop < messagesDiv.current.scrollHeight - 300 - window.innerHeight)
      messagesDiv.current?.scrollTo(0, messagesDiv.current?.scrollHeight)
    prevScrollHeight.current = 0
  }
  useEffect(() => {
    console.log(messagesDiv.current?.scrollTop, messagesDiv.current?.scrollHeight)
    if (messagesDiv.current && (page.current === 0)){
      if (messagesDiv.current.scrollTop < messagesDiv.current.scrollHeight - 300 - window.innerHeight)
        messagesDiv.current.scrollTo(0,messagesDiv.current.scrollHeight);
    }
    else if (messagesDiv.current){
      if (messagesDiv.current.scrollTop < messagesDiv.current.scrollHeight - 300 - window.innerHeight)
        messagesDiv.current.scrollTo(0,messagesDiv.current.scrollHeight - prevScrollHeight.current);
    }
  }, [isSubscribing, messagesDiv.current?.scrollHeight])
  if (!params.id) {
    return <div>No chat!</div>
  }
  if (isSubscribing) return <div className={'preloader'}><Preloader /></div>
  return <>
    <div className={'chat_dialog'}>
      <DialogHeader username={chat.username} picture={chat.picture}/>
      <div className={'chat_dialog__messages'} onScroll={(e) => scrollCallback(e)} ref={messagesDiv}>{messages.current}</div>
      <MessageInput scrollDown={() => scrollDown()}/>
    </div>
  </>
}
export default connect((state:RootState, ownProps) => {
  return {
    chat_id: state.chatReducer.chat_id
  }
}, dispatch => {return {}})(Dialog)