import {useRef, useState} from 'react'
import { encryptMessage } from '../../../Utils/encrypt'
import {RootState, sendMessage} from "../../../Reducers";
import {useSelector} from "react-redux";
import {useDispatch} from "@logux/redux";
import 'emoji-mart/css/emoji-mart.css'
import {EmojiData, Picker} from 'emoji-mart'

const MessageInput = (props: {
  scrollDown: () => void
}) => {
  const [message, setMessage] = useState('')
  const [showPicker, setShowPicker] = useState(false)
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
    props.scrollDown()
    inputRef.current?.focus()
    setShowPicker(false)
  }
  const handleEmojiSelect = (emoji: EmojiData) => {
    if (inputRef.current) {
      if ("native" in emoji) {
        inputRef.current.value += emoji.native
        setMessage(inputRef.current.value)
      }
    }
  }
  return <>
    <div className={'chat_dialog__input'}>
        <div className={'chat_dialog__input-wrap'}>
            <form className={'chat_dialog__input-wrap--form'} action="" onSubmit={(e) => handleSend(e)}>
              {showPicker ? <Picker emojiSize={24} perLine={8} onSelect={(emoji) => handleEmojiSelect(emoji)} /> : null}
              <span className="material-icons outlined" onClick={() => setShowPicker(!showPicker)}>
                mood
              </span>
              <input className={'chat_dialog__input-wrap--message'} type={'text'} placeholder={'Write a message...'} onInput={(e) => handleInput(e)} ref={inputRef}/>
              <button type={'submit'} className={'material-icons'}>send</button>
            </form>
        </div>
    </div>
  </>
}

export default MessageInput