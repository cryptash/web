import { ChatResponse } from '../../../../Typings/ChatReponse'
import ChatCard from './ChatCard'
import {nanoid} from 'nanoid'
import './ChatList.scss'
import { useSearch } from '../../../../Contexts/SearchReducer'
import store from "../../../../Logux/store";
import {useEffect, useState} from "react";
const ChatList = () => {
  const search = useSearch()
  const [ChatCards, setChatCards] = useState<Array<React.FunctionComponentElement<{chat: ChatResponse}>>>([])
  const listener = (chats: ChatResponse[]) => {
    const chatArray: Array<React.FunctionComponentElement<{chat: ChatResponse}>> = []
    if (search.state.chats)
      search.state.chats.forEach(user => {
        chatArray.push(<ChatCard chat={{
          chat_id: '',
          user,
          messages: []
        }} key={nanoid(5)}/>)
      })
    chats.forEach((chat: any) => {
      if (search.state.users) {
        if (chat.user.username.toLowerCase().includes(search.state.users.toLowerCase())) {
          chatArray.push(<ChatCard chat={chat} key={chat.chat_id}/>)
        }
      }
      else {
        chatArray.push(<ChatCard chat={chat} key={chat.chat_id}/>)
      }
    })
    if (chatArray === ChatCards) return
    setChatCards(chatArray)
  }
  useEffect(() => {
    store.subscribe(() => {
      listener(store.getState().userReducer.chats)
    })
  }, []);
  useEffect(() => {
    listener(store.getState().userReducer.chats)
  }, [search.state]);

  return <>
    <div className={'chat_list'}>{ChatCards}</div>
  </>
}
export default ChatList