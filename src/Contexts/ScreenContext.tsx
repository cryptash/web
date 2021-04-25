import React from 'react'

type Action = {type: 'CHANGE'}
type Dispatch = (action: Action) => void

const ScreenContext = React.createContext<
{state: {
    width: number,
    height: number
}; dispatch: Dispatch;} | undefined
>(undefined)

const screenReducer = (state: {
    width: number,
    height: number
}, action: Action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                height: window.innerHeight,
                width: window.innerWidth
            }
        default: {
          throw new Error(`Unhandled action type: ${action}`)
        }
      }
}
const initialState: {
    width: number,
    height: number
} = {
    width: window.innerWidth,
    height: window.innerHeight
}
const ScreenProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = React.useReducer(screenReducer, initialState)
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = {state, dispatch, }
    return <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>
}
const useScreen = () => {
    const context = React.useContext(ScreenContext)
    if (context === undefined) {
      throw new Error('useCount must be used within a CountProvider')
    }
    return context
  }
  
export {ScreenContext, ScreenProvider, useScreen}