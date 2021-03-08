import { decryptMessage } from "../../../Utils/decrypt"
import { formatDate, formatTime } from '../../../Utils/formatDate'

const Message: React.FunctionComponent<{
  content: string
  pub_key: string
  date: Date
  fromMe: boolean
}> = (props) => {
  let content:string = ''
  try {
    content = decryptMessage(localStorage.getItem('key'), props.content, props.pub_key).text
    
  } catch (error) {
    console.log(error)
  }
  return <>
    <div className={`chat_dialog__messages-message ${props.fromMe ? 'fromMe' : 'toMe'}`}>
      <div className={`chat_dialog__messages-message_top ${props.fromMe ? 'fromMe' : 'toMe'}`} >
        <div className={`chat_dialog__messages-message_top-bubble ${props.fromMe ? 'fromMe' : 'toMe'}`}>
          {content}
        </div>
        <div className={`chat_dialog__messages-message_top-context`}>
        <span className="material-icons">
          more_horiz
        </span>
        </div>
      </div>
      <div className={`chat_dialog__messages-message_bottom ${props.fromMe ? 'fromMe' : 'toMe'}`}>
         {formatTime(props.date)}
      </div>
    </div>
  </>
}

export default Message