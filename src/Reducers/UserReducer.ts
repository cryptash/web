import {ChatResponse} from "../Typings/ChatReponse";

interface UserState {
  username: string
  user_id: string
  pub_key: string
  picture: string
  chats: ChatResponse[]
}


const initialState: UserState = {
  user_id: '',
  username: '',
  pub_key: '',
  picture: '',
  chats: []
}

const userReducer = (state = initialState, action: {type: string, payload: any}) => {
  switch (action.type) {
    case 'login/done': {
      localStorage.setItem('token', action.payload.token)
      return state
    }
    case 'chat/message/create': {
      const chat = state.chats.filter(c => c.chat_id === action.payload.chat_id)
      console.log(chat)
      if (chat[0]) {
        chat[0].messages[0] = {
          content: action.payload.content,
          read: action.payload.read,
          date: action.payload.date,
          message_id: action.payload.message_id,
          fromMe: action.payload.from === localStorage.getItem('user_id')
        }
        chat[0].messageAt = action.payload.date
      }
      state.chats = state.chats.filter(x => x !== chat[0])
      state.chats.unshift(chat[0])
      return state
    }
    case 'user/get_info/done': {
      return action.payload
    }
    default: {
      return state
    }
  }
}
export {userReducer}