import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import './Register.scss';
import config from '../../config'
import { generateKeyPair } from "../../Utils/keysUtils";
import {Client} from "@logux/client";
import {AES} from 'crypto-js'
import store from "../../Logux/store";
const Register: React.FunctionComponent = () => {
  const [key] = useState(generateKeyPair())
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [doesMeetReqs, setMeetReq] = useState(false)
  const [isSame, setSame] = useState(false)
  let history = useHistory();
  const handleChange = (e: any) => {
    console.log(e.target.name, e.target.value)
    if (e.target.name === 'verify_password') {
        if (e.target.value === credentials.password) {
          setSame(true)
        }
        else {
          setSame(false)
        }
    }
    else {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
        if (e.target.name === 'password') {
          let pass_regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,31}$/ // 8 to 31 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
          if (e.target.value.match(pass_regexp)) {
            setMeetReq(true)
          }
          else {
            setMeetReq(false)
          }
        }
    }
  }
  function register (username: string, password: string, key: {
    private_key: string, public_key: string
  }) {
    if (!password || !username) return
    if (!isSame) return
    if (!doesMeetReqs) return
    if (username.length < 3) {
      alert("Username must be at least 3 symbols")
      return
    }
    let pass_regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,31}$/ // 8 to 31 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
    if (!password.match(pass_regexp)) {
      setMeetReq(false)
      return
    }
    let client = new Client({
      subprotocol: '1.0.0',
      server: config.socket_url,
      userId: 'anonymous'
    })
    client.on('add', (action: any) => {
      if (action.type === 'register/done') {
        localStorage.setItem('user_id', action.user_id)
        localStorage.setItem('token', action.token)
        localStorage.setItem('key', key.private_key)
        store.client.changeUser(action.user_id,action.token)
        history.push(`/`)
      } else if (action.type === 'logux/undo') {
        alert(action.reason)
      }
    })
    client.start()
    client.log.add({ type: 'register', username, password, private_key: AES.encrypt(key.private_key, password).toString(), pub_key: key.public_key}, { sync: true })
  }
  const firstStage = () => {
    return (
        <>
          <h1>Cryptash</h1>
          <input name={'username'} placeholder={'Username'} className={'register_main__form___username'} onChange={(e) => handleChange(e)}/>
          <input name={'password'} type={'password'} placeholder={'Password'} className={`register_main__form___password ${doesMeetReqs ? '' : 'red-outline'}`} onChange={(e) => handleChange(e)}/>
          <input name={'verify_password'} type={'password'} placeholder={'Verify Password'} className={`register_main__form___password ${isSame ? '' : 'red-outline'}`} onChange={(e) => handleChange(e)}/>
          <button type={'submit'} className={'register_main__form___submit'} disabled={!isSame}>Create account</button>
          <Link to={'/login'}>Back to login</Link>
        </>
  )
  }
  return <>
    <div className="register_main">
      <div className={'register_main__header'}>
          <h1 className={'register_main__header___title'}>Create your account</h1>
          <h2 className={'register_main__header___undertitle'}>If you already have an account, login using button below</h2>
      </div>
      <div className={'register_main__block'}>
        <form className={'register_main__form'} onSubmit={(e) =>{
          e.preventDefault()
          register(credentials.username, credentials.password, key)
        }}>
          {firstStage()}
        </form>
      </div>
    </div>
  </>

}

export default Register
