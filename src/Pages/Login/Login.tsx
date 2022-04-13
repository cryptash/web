import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './Login.scss'
import config from '../../config'
import { AES } from 'crypto-js'
import { enc } from 'crypto-js'
import { Client } from '@logux/client'
import store from '../../Logux/store'
function login(
  username: string,
  password: string,
  setStage: (p: string) => void
) {
  let client = new Client({
    subprotocol: '1.0.0',
    server: config.socket_url,
    userId: 'anonymous'
  })
  client.on('add', (action: any) => {
    if (action.type === 'login/done') {
      localStorage.setItem('user_id', action.user_id)
      localStorage.setItem('token', action.token)
      localStorage.setItem(
        'key',
        AES.decrypt(action.private_key, password).toString(enc.Utf8)
      )
      store.client.changeUser(action.user_id, action.token)
      setStage('/')
    } else if (action.type === 'logux/undo') {
      alert(action.reason)
    }
  })
  client.start()
  client.log.add({ type: 'login', username, password }, { sync: true })
}

const Login: React.FunctionComponent = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    key: ''
  })
  const handleChange = (e: any) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }
  useEffect(() => {
    if (localStorage.getItem('user_id') && localStorage.getItem('token'))
      history.push('/')
  }, [])
  const history = useHistory()
  return (
    <>
      <div className="login_main">
        <div className={'login_main__header'}>
          <h1 className={'login_main__header___title'}>
            Sign in into your account
          </h1>
          <h2 className={'login_main__header___undertitle'}>
            If you don't have account, sign up using button below
          </h2>
        </div>
        <div className={'login_main__block'}>
          <form
            className={'login_main__form'}
            onSubmit={(e) => {
              e.preventDefault()
              login(credentials.username, credentials.password, (p: string) =>
                history.push(p)
              )
            }}
          >
            <>
              <h1>Cryptash</h1>
              <input
                name={'username'}
                placeholder={'Username'}
                className={'login_main__form___username'}
                onChange={(e) => handleChange(e)}
              />
              <input
                name={'password'}
                type={'password'}
                placeholder={'Password'}
                className={'login_main__form___password'}
                onChange={(e) => handleChange(e)}
              />
              <button type={'submit'} className={'login_main__form___submit'}>
                Login
              </button>
              <Link to={'/register'}>Create new account</Link>
            </>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
