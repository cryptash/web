import {useEffect, useState} from "react";
import TimeAgo from "timeago-react";
import UserPicture from "../../../../Components/UserPicture/UserPicture";
import config from "../../../../config";
import { ChatResponse } from "../../../../Typings/ChatReponse";
import { decryptMessage } from "../../../../Utils/decrypt";
import { formatTime } from "../../../../Utils/formatDate";
import { useHistory } from 'react-router-dom';
import {useDispatch} from "@logux/redux";
import {createChat} from "../../../../Reducers";
import store from "../../../../Logux/store";

const ChatCard: React.FunctionComponent<{chat: ChatResponse}> = (props) => {
  const {chat} = props
  const [isRedirect, SetRedirect] = useState(false)
  let history = useHistory();
  const dispatch = useDispatch()
  useEffect(() => {
    store.client.log.type('chat/create/done', (action: {
      type: 'chat/create/done',
      payload: {
        chat_id: string
      }
    }, meta) => {
      history.push(`/${action.payload.chat_id}`)
    })
  }, []);

  console.log(chat.user.username, chat.messages[0] ? chat.messages[0].date : '')
  const generateText = () => {
    if (chat.messages[0]) {
        try {
          return decryptMessage(localStorage.getItem('key'),chat.messages[0].content, chat.user.pub_key).text
        }
        catch (e) {
          console.info(e.text)
          return ''
        }
    }
    return ''
  }
  const handleClick = (e: any) => {
    if (!chat.chat_id) {
      dispatch.sync(createChat({user_id: chat.user.user_id}))
    }
    else {
      history.push(`/${chat.chat_id}`)
    }
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
            generateText()
          }</span>
        </div>
      </div>
    </div>
  </>
}

export default ChatCard