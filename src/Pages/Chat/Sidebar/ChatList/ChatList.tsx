import { ChatResponse } from '../../../../Typings/ChatReponse'
import ChatCard from './ChatCard'
import {nanoid} from 'nanoid'
import './ChatList.scss'
import { useUser } from '../../../../Contexts/UserContext'
import { useSearch } from '../../../../Contexts/SearchReducer'
const ChatList = () => {
  const {state} = useUser()
  const search = useSearch()
  const ChatCards: Array<React.FunctionComponentElement<{chat: ChatResponse}>> = []
  if (search.state.chats) 
    search.state.chats.forEach(user => {
      ChatCards.push(<ChatCard chat={{
        chat_id: '',
        user,
        messages: []
      }} key={nanoid(5)}/>)
    })
  state.chats.forEach(chat => {
    if (search.state.users) {
        if (chat.user.username.toLowerCase().includes(search.state.users.toLowerCase())) {
          ChatCards.push(<ChatCard chat={chat} key={nanoid(5)}/>)
        }
    }
    else 
      ChatCards.push(<ChatCard chat={chat} key={nanoid(5)}/>)
  })
  return <>
    <div className={'chat_list'}>{ChatCards}</div>
  </>
}
export default ChatList