import React from 'react'
import { UserState } from '../Typings/UserState'

type Action =
  | { type: 'ADD_MESSAGE'; payload: any }
  | { type: 'CHANGE_USER'; payload: any }
  | { type: 'REMOVE_MESSAGE'; payload: any }
  | { type: 'EDIT_MESSAGE'; payload: any }
  | { type: 'ADD_CHAT'; payload: any }
type Dispatch = (action: Action) => void

const UserContext =
  React.createContext<{ state: UserState; dispatch: Dispatch } | undefined>(
    undefined
  )

const userReducer = (state: UserState, action: Action) => {
  const data = action.payload
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const chats = [...state.chats]
      chats.filter((e: any) => e.chat_id === data.chat_id)[0].messages = [data]
      chats.filter((e: any) => e.chat_id === data.chat_id)[0].messageAt =
        data.date
      chats.sort(
        (a, b): number =>
          new Date(b.messageAt ? b.messageAt : '').getTime() -
          new Date(a.messageAt ? a.messageAt : '').getTime()
      )
      return { ...state, chats }
    }
    case 'CHANGE_USER': {
      return { ...data }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
const initialState: UserState = {
  username: '',
  user_id: '',
  picture: '',
  pub_key: '',
  chats: [],
  addMessageToChat: () => {}
}
const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(userReducer, initialState)
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
const useUser = () => {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider')
  }
  return context
}

export { UserContext, UserProvider, useUser }
