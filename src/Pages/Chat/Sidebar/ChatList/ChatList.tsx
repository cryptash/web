import { ChatResponse } from '../../../../Typings/ChatReponse'
import ChatCard from './ChatCard'
import {nanoid} from 'nanoid'
import './ChatList.scss'
const ChatList = (props: {
  chats: Array<ChatResponse>
  pub_key: string
}) => {
  const ChatCards: Array<React.FunctionComponentElement<{chat: ChatResponse}>> = []
  props.chats.forEach(chat => {
    ChatCards.push(<ChatCard chat={chat} key={nanoid(5)}/>)
  })
  return <>
    <div className={'chat_list'}>{ChatCards}</div>
  </>
}
export default ChatList