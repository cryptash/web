import {useRef, useState} from 'react'
import { encryptMessage } from '../../../Utils/encrypt'
import {RootState, sendMessage} from "../../../Reducers";
import {useSelector} from "react-redux";
import {useDispatch} from "@logux/redux";

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const chat = useSelector((state: RootState) => state.chatReducer)
  const dispatch = useDispatch()
  const handleInput = (e: any) => {
    setMessage(e.target.value)
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const handleSend = (e: any) => {
    e.preventDefault()
    const msg = encryptMessage(
      localStorage.getItem('key'),
      {
        text: message,
      },
      chat.pub_key
    )
    dispatch.sync(sendMessage({chat_id: chat.chat_id, content: msg, from: localStorage.getItem('user_id')}))
    if (inputRef.current)
      inputRef.current.value = ''
      setMessage('')
  }
  return <>
    <div className={'chat_dialog__input'}>
        <div className={'chat_dialog__input-wrap'}>
            <form action="" onSubmit={(e) => handleSend(e)}>
                <input type={'text'} placeholder={'Write a message...'} onInput={(e) => handleInput(e)} ref={inputRef}/>
                <button type={'submit'} className={'material-icons'}>send</button>
            </form>
        </div>
    </div>
  </>
}

export default MessageInput