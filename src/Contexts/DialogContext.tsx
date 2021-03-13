import { nanoid } from 'nanoid'
import React from 'react'
import MessageComp from '../Pages/Chat/Dialog/Message'
import { Message } from '../Typings/Message'
import { UserState } from '../Typings/UserState'

type Action = {type: 'ADD_MESSAGE', payload: any}| {type: 'CHANGE_KEY', payload: any} | {type: 'REMOVE_MESSAGE', payload: any} | {type: 'EDIT_MESSAGE', payload: any} | {type: 'CHANGE_DIALOG', payload?: any}
type Dispatch = (action: Action) => void
type DialogState = {
    messages: Message[],
    username: string,
    pub_key: string,
    picture: string
    user_id: string,
}
const DialogContext = React.createContext<
{state: DialogState; dispatch: Dispatch} | undefined
>(undefined)
const dialogReducer = (state: DialogState, action: Action) => {
    const data = action.payload
    console.log(action)
    switch (action.type) {
        case 'ADD_MESSAGE': {
            state.messages.push(...data)
            return {...state,}
        }
        case 'CHANGE_DIALOG': {
            return {
                username: '',
                user_id: '',
                picture: '',
                pub_key: '',
                messages: [],
                messageComponents: []
            }
        }
        case 'CHANGE_KEY': {
            state.pub_key = action.payload
            return state
        }
        default: {
          throw new Error(`Unhandled action type: ${action.type}`)
        }
      }
}
const initialState: DialogState = {
    username: '',
    user_id: '',
    picture: '',
    pub_key: '',
    messages: [],
}
const DialogProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = React.useReducer(dialogReducer, initialState)
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = {state, dispatch, }
    return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}
const useDialog = () => {
    const context = React.useContext(DialogContext)
    if (context === undefined) {
      throw new Error('useCount must be used within a CountProvider')
    }
    return context
  }
  
export {DialogContext, DialogProvider, useDialog}