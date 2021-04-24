import React, { useEffect } from 'react';
import './App.css';
import { useScreen } from './Contexts/ScreenContext';

const App: React.FunctionComponent = ({children}) => {
  const {dispatch} = useScreen()
  useEffect(() => {
    window.addEventListener('resize', (e) => {
      dispatch({type: 'CHANGE'})
    })
  }, [])
  return <>
    {children}
  </>
}
export default App;
