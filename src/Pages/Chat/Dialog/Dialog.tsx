import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react'
import Preloader from '../../../Components/Preloader/Preloader'
import './Dialog.scss'
import MessageInput from './MessageInput'
import { useParams } from 'react-router'
import DialogHeader from './DialogHeader'
import { useDispatch, useSubscription } from '@logux/redux'
import { connect, useSelector } from 'react-redux'
import {
  changeChat,
  getMessages,
  RootState,
  setChatId
} from '../../../Reducers'
import Message from './Message'
import * as MessageTyping from '../../../Typings/Message'
const Dialog: FunctionComponent<{
  chat_id: string
  messages: MessageTyping.Message[]
  pub_key: string
  status: string
  username: string
  picture: string
}> = (props) => {
  let params: { id: string } = useParams()
  const dispatch = useDispatch()
  const page = useRef(0)
  const prevScrollHeight = useRef(0)
  const [isRequested, setRequested] = useState(false)
  const isSubscribing = useSubscription(
    props.chat_id ? [`chat/${props.chat_id}`] : []
  )
  let chat = useSelector((state: RootState) => state.chatReducer)
  const messagesDiv = useRef<HTMLDivElement>(null)
  const callbacks = useRef<Array<Function>>([])

  const subscribeToScroll = (callback: Function) => {
    callbacks.current.push(callback)
    return () => callbacks.current.filter((x) => x !== callback)
  }

  useEffect(() => {
    dispatch(setChatId({ id: params.id }))
  }, [dispatch, params.id])

  useEffect(() => {
    dispatch(changeChat({ id: params.id }))
  }, [dispatch, params.id])

  const scrollCallback = (e: any) => {
    callbacks.current.forEach((callback) => {
      callback(e)
    })
    if (e.target.scrollTop === 0) {
      if (!isRequested) {
        page.current = page.current + 1
        prevScrollHeight.current = messagesDiv.current
          ? messagesDiv.current.scrollHeight
          : 0
        setRequested(true)
        dispatch
          .sync(getMessages({ pg: page.current, chat_id: params.id }))
          .then(() => setRequested(false))
      }
    }
  }

  const mes = useMemo(() => {
    const msgComp: Array<JSX.Element> = []
    props.messages.forEach(
      (m: {
        content: string
        fromMe: boolean
        date: Date
        read: boolean
        message_id: string
      }) => {
        return msgComp.push(
          <Message
            id={m.message_id}
            subscribeToScroll={(c: Function) => subscribeToScroll(c)}
            isRead={m.read}
            content={m.content}
            pub_key={props.pub_key}
            key={m.message_id}
            fromMe={m.fromMe}
            date={m.date}
          />
        )
      }
    )
    return msgComp
  }, [props.messages, props.pub_key])

  const scrollDown = () => {
    if (
      messagesDiv.current &&
      messagesDiv.current.scrollTop <
        messagesDiv.current.scrollHeight - 300 - window.innerHeight
    )
      messagesDiv.current?.scrollTo(0, messagesDiv.current?.scrollHeight)
    prevScrollHeight.current = 0
  }
  useEffect(() => {
    if (messagesDiv.current && page.current === 0) {
      if (
        messagesDiv.current.scrollTop <
        messagesDiv.current.scrollHeight - 300 - window.innerHeight
      )
        messagesDiv.current.scrollTo(0, messagesDiv.current.scrollHeight)
    } else if (messagesDiv.current) {
      if (
        messagesDiv.current.scrollTop <
        messagesDiv.current.scrollHeight - 300 - window.innerHeight
      )
        messagesDiv.current.scrollTo(
          0,
          messagesDiv.current.scrollHeight - prevScrollHeight.current
        )
    }
  }, [isSubscribing, messagesDiv.current?.scrollHeight])
  if (!params.id) {
    return <div>No chat!</div>
  }
  if (isSubscribing)
    return (
      <div className={'preloader'}>
        <Preloader />
      </div>
    )
  return (
    <>
      <div className={'chat_dialog'}>
        <DialogHeader username={props.username} picture={props.picture} status={props.status}/>
        <div
          className={'chat_dialog__messages'}
          onScroll={(e) => scrollCallback(e)}
          ref={messagesDiv}
        >
          {mes}
        </div>
        <MessageInput scrollDown={() => scrollDown()} />
      </div>
    </>
  )
}
export default connect(
  (state: RootState, ownProps) => {
    return {
      chat_id: state.chatReducer.chat_id,
      messages: [...state.chatReducer.messages],
      pub_key: state.chatReducer.pub_key,
      status: state.chatReducer.status,
      username: state.chatReducer.username,
      picture: state.chatReducer.picture
    }
  },
  (dispatch) => {
    return {}
  }
)(Dialog)
