import { useState } from "react";
import { Redirect } from "react-router-dom";
import UserPicture from "../../../../Components/UserPicture/UserPicture";
import { ChatResponse } from "../../../../Typings/ChatReponse";
import { decryptMessage } from "../../../../Utils/decrypt";
import { formatDate } from "../../../../Utils/formatDate";

const ChatCard: React.FunctionComponent<{chat: ChatResponse}> = (props) => {
  const {chat} = props
  const [isRedirect, SetRedirect] = useState(false)
  
  if (isRedirect) {
    return <Redirect to={`/${chat.chat_id}`} />
  }
  console.log(chat)
  if (chat.messages[0])
    console.log(decryptMessage(localStorage.getItem('key'),chat.messages[0].content, chat.user.pub_key))
  return <>
    <div className={'chat_list__card'} onClick={(e) => SetRedirect(true)}>
      <UserPicture username={chat.user.username} picture={chat.user.picture}/>
      <div className={'right'}>
        <div className={'chat_list__card___top'}>
          <span className={'chat_list__card___top____username'}>{chat.user.username}</span>
          <span className={'chat_list__card___top____date'}>
            {chat.messages[0] ? formatDate(chat.messageAt) : ''}
          </span>
        </div>
        <div className={'chat_list__card___bottom'}>
          <span className={'chat_list__card___top____content'}>{
            chat.messages[0] ? decryptMessage(localStorage.getItem('key'),chat.messages[0].content, chat.user.pub_key).text : ''
          }</span>
        </div>
      </div>
    </div>
  </>
}

export default ChatCard