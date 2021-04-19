import { useState } from "react";
import { Redirect } from "react-router-dom";
import TimeAgo from "timeago-react";
import UserPicture from "../../../../Components/UserPicture/UserPicture";
import config from "../../../../config";
import { ChatResponse } from "../../../../Typings/ChatReponse";
import { decryptMessage } from "../../../../Utils/decrypt";
import { formatTime } from "../../../../Utils/formatDate";

const ChatCard: React.FunctionComponent<{chat: ChatResponse}> = (props) => {
  const {chat} = props
  const [isRedirect, SetRedirect] = useState(false)
  const handleClick = (e: any) => {
    if (!chat.chat_id) {
      const headers = new Headers({
        'Content-Type': 'application/json',
      })
      headers.append( 'Authorization', `${localStorage.getItem('token')}`)
      fetch(config.server_url + 'api/chat/create', {
        method: 'POST',
        body: JSON.stringify({
          user_id: chat.user.user_id,
        }),
        headers,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode !== 200) {
            alert(res.message)
          } else {
            chat.chat_id = res.chat_id
            SetRedirect(true)
          }
        })
    }
    else {
      SetRedirect(true)
    }
  }
  if (isRedirect) {
    return <Redirect to={`/${chat.chat_id}`} />
  }
  return <>
    <div className={'chat_list__card'} onClick={(e) => handleClick(e)}>
      <UserPicture username={chat.user.username} picture={chat.user.picture}/>
      <div className={'right'}>
        <div className={'chat_list__card___top'}>
          <span className={'chat_list__card___top____username'}>{chat.user.username}</span>
          <span className={'chat_list__card___top____date'}>
            {chat.messages[0] && chat.messageAt ? formatTime(chat.messageAt) ? formatTime(chat.messageAt) : <TimeAgo datetime={chat.messageAt} opts={{minInterval: 5}}/> : ''}
          </span>
        </div>
        <div className={'chat_list__card___bottom'}>
          <span className={'chat_list__card___bottom____content'}>{
            chat.messages[0] ? decryptMessage(localStorage.getItem('key'),chat.messages[0].content, chat.user.pub_key).text : ''
          }</span>
        </div>
      </div>
    </div>
  </>
}

export default ChatCard