import { FunctionComponent, useEffect, useMemo } from 'react'
import TimeAgo from 'timeago-react'
import UserPicture from '../../../../Components/UserPicture/UserPicture'
import { ChatResponse } from '../../../../Typings/ChatReponse'
import { decryptMessage } from '../../../../Utils/decrypt'
import { formatTime } from '../../../../Utils/formatDate'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from '@logux/redux'
import { createChat } from '../../../../Reducers'
import store from '../../../../Logux/store'
import { useParams } from 'react-router'

const ChatCard: FunctionComponent<{ chat: ChatResponse }> = (props) => {
  const { chat } = props
  let navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  useEffect(() => {
    store.client.log.type(
      'chat/create/done',
      (
        action: {
          type: 'chat/create/done'
          payload: {
            chat_id: string
          }
        },
        _
      ) => {
        navigate(`/${action.payload.chat_id}`)
      }
    )
  }, [navigate])
  const text = useMemo(() => {
    if (chat.messages[0]) {
      try {
        return decryptMessage(
          localStorage.getItem('key'),
          chat.messages[0].content,
          chat.user.pub_key
        ).text
      } catch (e) {
        return ''
      }
    }
    return ''
  }, [chat.messages[0], chat.user.pub_key])
  const handleClick = (_: any) => {
    if (!chat.chat_id) {
      dispatch.sync(createChat({ user_id: chat.user.user_id }))
    } else {
      navigate(`/${chat.chat_id}`)
    }
  }
  return (
    <>
      <div
        className={`chat_list__card ${
          params.id === props.chat.chat_id ? 'active' : ''
        }`}
        onClick={(e) => handleClick(e)}
      >
        <UserPicture
          username={chat.user.username}
          picture={chat.user.picture}
        />
        <div className={'right'}>
          <div className={'chat_list__card___top'}>
            <span className={'chat_list__card___top____username'}>
              {chat.user.username}
            </span>
            <span className={'chat_list__card___top____date'}>
              {chat.messages[0] && chat.messageAt ? (
                formatTime(chat.messageAt) ? (
                  formatTime(chat.messageAt)
                ) : (
                  <TimeAgo
                    datetime={chat.messageAt}
                    opts={{ minInterval: 5 }}
                  />
                )
              ) : (
                ''
              )}
            </span>
          </div>
          <div className={'chat_list__card___bottom'}>
            <span className={'chat_list__card___bottom____content'}>
              {text}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatCard
