import {ChatResponse} from "../Typings/ChatReponse";
import {Message} from "../Typings/Message";
import store from "../Logux/store";

type ChatState = {
  messages: Message[],
  username: string,
  pub_key: string,
  picture: string
  user_id: string,
  chat_id: string
}


const initialState: ChatState = {
  username: '',
  user_id: '',
  picture: '',
  pub_key: '',
  chat_id: '',
  messages: [],
}
const chatReducer = (state = initialState, action: {type: string, payload?: any, id?: string}) => {
  const data = action.payload
  switch (action.type) {
    case 'chat/message/add': {
      console.log('NEW MESSAGE')
      state.messages.push(...data)
      return {...state}
    }
    case 'chat/load_messages/done': {
      state.messages = [...data.messages, ...state.messages]
      state.pub_key = data.pub_key
      return {...state}
    }
    case 'chat/change': {
      // store.dispatch.sync({ type: 'logux/unsubscribe', channel: `chat/${state.chat_id}` })
      // store.dispatch.sync({ type: 'logux/subscribe', channel: `chat/${action.payload.id}` })
      return {
        username: '',
        user_id: '',
        picture: '',
        pub_key: '',
        chat_id: action.payload.id,
        messages: [],
      }
    }
    case 'chat/messages/send': {
      console.log(action.payload)
      state.messages.push({
        content: action.payload.content,
        read: false,
        date: new Date(),
        message_id: '',
        fromMe: true
      })
      console.log(state.messages)
      return state
    }
    case 'chat/message/setId': {
      state.messages[state.messages.length - 1].message_id = action.payload.id
      return state
    }
    case 'chat/message/create': {
      if (state.chat_id === action.payload.chat_id && action.payload.from !== localStorage.getItem('user_id')) {
        if (!state.messages.filter(m => action.payload.message_id === m.message_id)[0]) {
          state.messages.push({
            content: action.payload.content,
            read: action.payload.read,
            date: action.payload.date,
            message_id: action.payload.message_id,
            fromMe: action.payload.from === localStorage.getItem('user_id')
          })
        }
      }
      return state
    }
    case 'chat/change_key': {
      state.pub_key = action.payload
      return state
    }
    case 'chat/set_id': {
      state.chat_id = action.payload.id
      console.log(state)
      return state
    }
    case 'chat/message/read': {
      const msg = state.messages.filter(x => x.message_id === data.id)[0]
      msg.read = true
      console.log(state)
      return state
    }
    case 'chat/data/set': {
      return {...state, ...data}
    }
    default: {
      return state
    }
  }
}
const userReducer = (state = initialState, action: {type: string, payload: any}) => {
  switch (action.type) {
    case 'login/done': {
      localStorage.setItem('token', action.payload.token)
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
export {chatReducer}