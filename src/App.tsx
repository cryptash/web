import React, { useEffect } from 'react'
import './App.css'
import { useScreen } from './Contexts/ScreenContext'

const App: React.FunctionComponent = ({ children }) => {
  const { dispatch } = useScreen()
  useEffect(() => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', (e) => {
      dispatch({ type: 'CHANGE' })
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }, [dispatch])
  return <>{children}</>
}
export default App
