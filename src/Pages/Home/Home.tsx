import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import Preloader from "../../Components/Preloader/Preloader";
import config from '../../config'
import { UserProvider } from '../../Contexts/UserContext';
import Chat from '../Chat/Chat';

const Home: React.FunctionComponent = () => {
  const [isLoggined, setLoginned] = useState(0)
  const token = localStorage.getItem('token')

  // Check if authenticated
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetch(config.server_url+ 'api/checkAuth', {
        method: 'POST',
        body: JSON.stringify({token}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
          .then((res) => res.json())
          .then((res) => setLoginned(res.statusCode === 200 ? 2 : 1))
    } else {
      setLoginned(1)
    }
  }, [token])
    if (isLoggined === 0) {
    return <Preloader />
  }

  if (isLoggined === 1) {
    return <Redirect to={'/login'}/>
  }


  return (<UserProvider>
    <Chat />
  </UserProvider>)
  
}

export default Home
