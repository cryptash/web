import React from 'react'
import { SearchFilter } from '../Typings/SearchFilter'

type Action = {type: 'CHANGE_FILTER', payload: {
    type: string
    filter: string
}} | {type: 'CHANGE_CHATS', payload: {
    chats: Array<{
        username: string
        picture: string
        user_id: string
    }>
}}
type Dispatch = (action: Action) => void

const SearchContext = React.createContext<
{state: SearchFilter; dispatch: Dispatch;} | undefined
>(undefined)

const searchReducer = (state: SearchFilter, action: Action) => {
    switch (action.type) {
        case 'CHANGE_FILTER':
            if (action.payload.type === 'users')
                if (action.payload.filter === '')
                    return {
                        ...state, 
                        chats: [],
                        [action.payload.type]: action.payload.filter
                    }
            return {
                    ...state, 
                    [action.payload.type]: action.payload.filter
                }
        case 'CHANGE_CHATS': 
            return {
                ...state,
                chats: action.payload.chats
            }
        default: {
          throw new Error(`Unhandled action type: ${action}`)
        }
      }
}
const initialState: SearchFilter = {
    users: '',
    messages: '',
    chats: []
}
const SearchProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = React.useReducer(searchReducer, initialState)
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = {state, dispatch, }
    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}
const useSearch = () => {
    const context = React.useContext(SearchContext)
    if (context === undefined) {
      throw new Error('useCount must be used within a CountProvider')
    }
    return context
  }
  
export {SearchContext, SearchProvider, useSearch}