import React, { useEffect, useMemo, useRef, useState } from "react";
import { decryptMessage } from "../../../Utils/decrypt"
import { formatTime } from '../../../Utils/formatDate'
import TimeAgo from 'timeago-react';
import { useParams } from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../../../Reducers";
const Message: React.FunctionComponent<{
  content: string
  pub_key: string
  date: Date
  fromMe: boolean
  isRead: boolean
  id: string
  socket: WebSocket
  subscribeToScroll: Function
}> = (props) => {
  const pub_key = useSelector((state: RootState) => state.chatReducer.pub_key)
  let content:string = useMemo(() => {
    try {
      return decryptMessage(localStorage.getItem('key'), props.content, pub_key).text
    } catch (error) {
      console.log({error, props})
      return ''
    }
  }, [props]);
  const [isRead, setRead] = useState(props.isRead)
  const messageRef = useRef<HTMLDivElement>(null)
  const isActionSent = useRef(false)
  const params: {id: string} = useParams()
  const scrollCallback = () => {
    if (isRead || props.fromMe || isActionSent.current) return
    const rect = messageRef.current?.getBoundingClientRect()
    if (rect) {
      if (rect.top > 0) {
        // console.log('message read by me' + props.id)
          // props.socket.send(JSON.stringify({
          //   action: 'mark_as_read',
          //   chatId: params.id,
          //   messageId: props.id,
          //   token: localStorage.getItem('token')
          // }))
          // isActionSent.current = true
          // setRead(true)
      }
    }
  }
  useEffect(() => {
    if (!isRead && !props.fromMe) {
        const a = props.subscribeToScroll(scrollCallback)
        return a()
    }
    if (!isRead && props.fromMe) {
      // props.socket.addEventListener('message', (ev) => {
      //   const response = JSON.parse(ev.data)
      //   if (response.action === 'message_read_by_user') {
      //     if (response.data.chat_id === params.id && response.data.message_id === props.id){
      //       setRead(true)
      //     }
      //   }
      // })
    }
  }, [isRead])
  useEffect(() => {
    scrollCallback()
  }, [])
  return <>
    <div className={`chat_dialog__messages-message ${props.fromMe ? 'fromMe' : 'toMe'}`} ref={messageRef}>
      <div className={`chat_dialog__messages-message_top ${props.fromMe ? 'fromMe' : 'toMe'}`} >
        <div className={`chat_dialog__messages-message_top-bubble ${props.fromMe ? 'fromMe' : 'toMe'}`}>
          <span>{content}</span>
        </div>
        <div className={`chat_dialog__messages-message_top-context`}>
          <span className="material-icons">
            more_horiz
          </span>
        </div>
        {
          props.fromMe ? (<div className={`chat_dialog__messages-message_top-status`}>
          <span className="material-icons">
            {isRead ? 'done_all' :'done'}
          </span>
        </div>) : ''
        }
        
      </div>
      <div className={`chat_dialog__messages-message_bottom ${props.fromMe ? 'fromMe' : 'toMe'}`}>
      {formatTime(props.date) ? formatTime(props.date) :<TimeAgo
        datetime={props.date}
        opts={{minInterval: 10}}
      />}
      </div>
    </div>
  </>
}

export default Message