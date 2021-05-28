import React, { useEffect, useMemo, useRef, useState } from 'react'
import { decryptMessage } from '../../../Utils/decrypt'
import { formatTime } from '../../../Utils/formatDate'
import TimeAgo from 'timeago-react'
import { useSelector } from 'react-redux'
import { RootState, setMessageRead } from '../../../Reducers'
import { useDispatch } from '@logux/redux'
import store from '../../../Logux/store'

const Message: React.FunctionComponent<{
  content: string
  pub_key: string
  date: Date
  fromMe: boolean
  isRead: boolean
  id: string
  subscribeToScroll: Function
}> = (props) => {
  let content: string = useMemo(() => {
    try {
      return decryptMessage(
        localStorage.getItem('key'),
        props.content,
        props.pub_key
      ).text
    } catch (error) {
      return ''
    }
  }, [props.content, props.pub_key])
  const [isRead, setRead] = useState(props.isRead)
  const messageRef = useRef<HTMLDivElement>(null)
  const isActionSent = useRef(false)
  const chat = useSelector((x: RootState) => x.chatReducer)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!isRead)
      store.subscribe(() => {
        const messages = store.getState().chatReducer.messages
        const message = messages.filter(
          (m: any) => m.message_id === props.id
        )[0]
        if (message && message.read && !isRead) {
          setRead(true)
        }
      })
  }, [isRead, props.id])
  useEffect(() => {
    const scrollCallback = () => {
      if (isRead || props.fromMe || isActionSent.current) return
      const rect = messageRef.current?.getBoundingClientRect()
      if (rect) {
        if (rect.top > 0) {
          isActionSent.current = true
          dispatch
            .sync(
              setMessageRead({
                chat_id: chat.chat_id,
                message_id: props.id
              })
            )
            .then(() => (isActionSent.current = false))
          setRead(true)
        }
      }
    }
    scrollCallback()
  }, [chat.chat_id, dispatch, isRead, props.fromMe, props.id])

  const urlRE = new RegExp(
    '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+',
    'g'
  )
  const urls = content.match(urlRE)
  const generateMessageWithUrl = () => {
    let c = content
    const res: JSX.Element[] = []
    if (!urls) return content
    urls.forEach((url) => {
      const split = c.split(url)
      if (split[0] !== '') res.push(<span>{split[0]}</span>)
      res.push(
        <a
          rel={'noopener'}
          href={url.includes('http') ? url : 'https://' + url}
        >
          <span className={'chat_dialog__messages-message_top-bubble--link'}>
            {url}
          </span>
        </a>
      )
      c = split[1]
    })
    return res
  }
  return (
    <>
      <div
        className={`chat_dialog__messages-message ${
          props.fromMe ? 'fromMe' : 'toMe'
        }`}
        ref={messageRef}
      >
        <div
          className={`chat_dialog__messages-message_top ${
            props.fromMe ? 'fromMe' : 'toMe'
          }`}
        >
          <div
            className={`chat_dialog__messages-message_top-bubble ${
              props.fromMe ? 'fromMe' : 'toMe'
            }`}
          >
            {generateMessageWithUrl()}
          </div>
          <div className={`chat_dialog__messages-message_top-context`}>
            <span className="material-icons">more_horiz</span>
          </div>
          {props.fromMe ? (
            <div className={`chat_dialog__messages-message_top-status`}>
              <span className="material-icons">
                {isRead ? 'done_all' : 'done'}
              </span>
            </div>
          ) : (
            ''
          )}
        </div>
        <div
          className={`chat_dialog__messages-message_bottom ${
            props.fromMe ? 'fromMe' : 'toMe'
          }`}
        >
          {formatTime(props.date) ? (
            formatTime(props.date)
          ) : (
            <TimeAgo datetime={props.date} opts={{ minInterval: 10 }} />
          )}
        </div>
      </div>
    </>
  )
}

export default Message
