import React, {useState, useEffect} from 'react';
import { Spin } from 'antd';
import {Redirect} from 'react-router-dom';
import Preloader from "../../Components/Preloader/Preloader";

const Home: React.FunctionComponent = () => {
  const [isLoggined, setLoginned] = useState(0)
  const socket = new WebSocket('ws://localhost:9000')
  const token = localStorage.getItem('token')

  // Function to bind socket and listen to it's actions
  const bindSocket = () => {
    socket.onopen = () => {
      socket.send(
          JSON.stringify({action: 'register', jwt: token})
      )
    }
    socket.addEventListener('message', (event: any) => {
      const response = JSON.parse(event.data)
      // console.dir(response)
      if (!response.data) {
        return
      }
      if (response.data.message === 'Successful connection') {
        console.warn(`Socket: Successful connection`)
      }
      if (response.action === 'new_message') {
        // this.fetchData()
      }
    })
  }

  // Check if authenticated
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetch('http://' + 'localhost:9000' + '/api/checkAuth', {
        method: 'POST',
        body: JSON.stringify({token: localStorage.getItem('token')}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
          .then((res) => res.json())
          .then((res) => setLoginned(res.statusCode === 200 ? 2 : 1))
    } else {
      setLoginned(1)
    }
  }, [])

  // Connect to socket
  useEffect(() => {
    bindSocket()
  }, [])

  if (isLoggined === 0) {
    return <Preloader />
  }

  if (isLoggined === 1) {
    return <Redirect to={'/login'}/>
  }


  return <>Hello World</>
}

export default Home
