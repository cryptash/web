import React from 'react'
import { Message } from '../Typings/Message'

type Action = {type: 'ADD_MESSAGE', payload: any} | 
    {type: 'ADD_MORE_MESSAGES', payload: any} | 
    {type: 'CHANGE_KEY', payload: any} | 
    {type: 'REMOVE_MESSAGE', payload: any} | 
    {type: 'EDIT_MESSAGE', payload: any} | 
    {type: 'CHANGE_DIALOG', payload?: any} |
    {type: 'SET_DIALOG_DATA', payload?: {
        username?: string,
        pub_key?: string,
        user_id?: string,
        picture?: string
    }} |
    {type: 'SET_MESSAGE_READ_STATUS', payload: {id: string}}
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
            console.log('NEW MESSAGE')
            state.messages.push(...data)
            return {...state}
        }
        case 'ADD_MORE_MESSAGES': {
            state.messages = [...data, ...state.messages]
            return {...state}
        }
        case 'CHANGE_DIALOG': {
            return {
                username: '',
                user_id: '',
                picture: '',
                pub_key: '',
                messages: [],
            }
        }
        case 'CHANGE_KEY': {
            state.pub_key = action.payload
            return state
        }
        case 'SET_MESSAGE_READ_STATUS': {
            const msg = state.messages.filter(x => x.message_id === data.id)[0]
            msg.read = true
            console.log(state)
            return state
        }
        case 'SET_DIALOG_DATA': {
            return {...state, ...data}
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