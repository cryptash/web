import {useRef, useState} from 'react'
import { useDialog } from '../../../Contexts/DialogContext'
import { encryptMessage } from '../../../Utils/encrypt'

const MessageInput: React.FunctionComponent<{
  socket: WebSocket,
  chat_id: string
}> = (props) => {
  const [message, setMessage] = useState('')
  const {state} = useDialog()
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
      state.pub_key
    )
    props.socket.send(JSON.stringify(
      {
        action: 'send_message',
        chatId: props.chat_id,
        content: msg,
        token: localStorage.getItem('token'),
      }
  ))
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