import { ChatResponse } from '../../../../Typings/ChatReponse'
import ChatCard from './ChatCard'
import {nanoid} from 'nanoid'
import './ChatList.scss'
import { useSearch } from '../../../../Contexts/SearchReducer'
import {useSelector} from "react-redux";
import {RootState} from "../../../../Reducers";
import {connector, Props} from "../../../../Logux/connect";
const ChatList = (props: Props) => {
  const search = useSearch()
  const chats = useSelector((state: RootState) => state.userReducer.chats )
  const listener = () => {
    const chatArray: Array<React.FunctionComponentElement<{chat: ChatResponse}>> = []
    if (search.state.chats[0])
      search.state.chats.forEach(user => {
        chatArray.push(<ChatCard chat={{
          chat_id: '',
          user,
          messages: []
        }} key={nanoid(5)}/>)
      })
    props.user.chats.forEach((chat: any) => {
      if (search.state.users) {
        if (chat.user.username.toLowerCase().includes(search.state.users.toLowerCase())) {
          chatArray.push(<ChatCard chat={chat} key={chat.chat_id}/>)
        }
      }
      else {
        chatArray.push(<ChatCard chat={chat} key={chat.chat_id}/>)
      }
    })
    return chatArray
  }
  return <>
    <div className={'chat_list'}>{listener()}</div>
  </>
}
export default connector(ChatList)