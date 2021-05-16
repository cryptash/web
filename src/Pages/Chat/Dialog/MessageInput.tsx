import {useRef, useState} from 'react'
import { encryptMessage } from '../../../Utils/encrypt'
import {connector, Props} from "../../../Logux/connect";

const MessageInput: React.FunctionComponent<Props> = (props) => {
  const [message, setMessage] = useState('')
  const handleInput = (e: any) => {
    setMessage(e.target.value)
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const handleSend = (e: any) => {
    console.log(props.chat)
    e.preventDefault()
    const msg = encryptMessage(
      localStorage.getItem('key'),
      {
        text: message,
      },
      props.chat.pub_key
    )
    props.sendMessage(msg, props.chat.chat_id, localStorage.getItem('user_id'))
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

export default connector(MessageInput)