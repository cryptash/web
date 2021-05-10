import React, {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import './Login.scss';
import Preloader from "../../Components/Preloader/Preloader";
import config from '../../config'
import { nanoid } from "nanoid";
import {Client} from "@logux/client";
function login (username: string, password: string, setStage: (n: number) => void, stage: number) {
  let client = new Client({
    subprotocol: '1.0.0',
    server: config.socket_url,
    userId: 'anonymous'
  })
  client.on('add', (action: any) => {
    if (action.type === 'login/done') {
      localStorage.setItem('user_id', action.user_id)
      localStorage.setItem('token', action.token)
      setStage(1)
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
  const [stage, setStage] = useState(0)
  const handleChange = (e: any) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }
  const firstStage = () => {
    return (
        <>
          <h1>Cryptash</h1>
          <input name={'username'} placeholder={'Username'} className={'login_main__form___username'} onChange={(e) => handleChange(e)}/>
          <input name={'password'} type={'password'} placeholder={'Password'} className={'login_main__form___password'} onChange={(e) => handleChange(e)}/>
          <button type={'submit'} className={'login_main__form___submit'}>Login</button>
          <Link to={'/register'}>Create new account</Link>
        </>
  )
  }
  const secondStage = () => {
    if (stage === 1) return (
        <>
          <h3>One more thing</h3>
          <h4>Please enter your private key</h4>
          <input type={'text'}
                 className={'login_main__form___privatekey'}
                 autoComplete={'off'}
                 placeholder={'Private key'}
                 key={localStorage.getItem('token')}
                 onChange={(e) => localStorage.setItem('key', e.target.value)}
          />
          <button type={'submit'} className={'login_main__form___submit'} onSubmit={(e) => {
            if (localStorage.getItem('key')) {
              setStage(2)
            }
          }}>Login</button>
        </>
    )
    else return <Redirect to={'/'} />
  }
  return <>
    <div className="login_main">
      <div className={'login_main__header'}>
          <h1 className={'login_main__header___title'}>Sign in into your account</h1>
          <h2 className={'login_main__header___undertitle'}>If you don't have account, sign up using button below</h2>
      </div>
      <div className={'login_main__block'}>
        <form className={'login_main__form'} onSubmit={(e) =>{
          e.preventDefault()
          login(credentials.username, credentials.password, (n: number) => setStage(n), stage)
        }}>
          {stage ? secondStage() : firstStage()}
        </form>
      </div>
    </div>
  </>

}

export default Login
