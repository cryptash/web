import {Message} from "../Typings/Message";

export type ChatState = {
  messages: Message[],
  username: string,
  pub_key: string,
  picture: string,
  user_id: string,
  chat_id: string,
  read_messages: string[]
}


const initialState: ChatState = {
  username: '',
  user_id: '',
  picture: '',
  pub_key: '',
  chat_id: '',
  messages: [],
  read_messages: []
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
      return {
        username: '',
        user_id: '',
        picture: '',
        pub_key: '',
        chat_id: action.payload.id,
        messages: [],
        read_messages: []
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
      return {...state}
    }
    case 'chat/message/setId': {
      if (state.chat_id === action.payload.chat_id) {
        state.messages[state.messages.length - 1].message_id = action.payload.id
        if (state.read_messages.includes(action.payload.id))
          state.messages[state.messages.length - 1].read = true
      }
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
      return {...state}
    }
    case 'chat/change_key': {
      state.pub_key = action.payload
      return {...state}
    }
    case 'chat/set_id': {
      state.chat_id = action.payload.id
      console.log(state)
      return {...state}
    }
    case 'chat/message/read': {
      if (action.payload.chat_id === state.chat_id) {
        const message = state.messages.filter(m => m.message_id === action.payload.message_id)[0]
        if (message)
          state.messages.filter(m => m.message_id === action.payload.message_id)[0].read = true
        else
          state.read_messages.push(action.payload.message_id)
      }
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
export {chatReducer}