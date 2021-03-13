import { ChatResponse } from '../../../../Typings/ChatReponse'
import ChatCard from './ChatCard'
import {nanoid} from 'nanoid'
import './ChatList.scss'
import { useUser } from '../../../../Contexts/UserContext'
const ChatList = () => {
  const {state} = useUser()
  const ChatCards: Array<React.FunctionComponentElement<{chat: ChatResponse}>> = []
  state.chats.forEach(chat => {
    ChatCards.push(<ChatCard chat={chat} key={nanoid(5)}/>)
  })
  return <>
    <div className={'chat_list'}>{ChatCards}</div>
  </>
}
export default ChatList