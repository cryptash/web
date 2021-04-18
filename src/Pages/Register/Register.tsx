import React, {useEffect, useRef, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import './Register.scss';
import Preloader from "../../Components/Preloader/Preloader";
import config from '../../config'
import { generateKeyPair } from "../../Utils/keysUtils";

const Register: React.FunctionComponent = () => {
  const [key, setKeys] = useState(generateKeyPair())
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [doesMeetReqs, setMeetReq] = useState(false)
  const [stage, setStage] = useState(0)
  const [isSame, setSame] = useState(false)
  const [isLoading, setLoading] = useState(true)
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
  const handleRegister = (credentials: {
    username?: string,
    password?: string,
    key?:string
  }, stage: number, setStage: any) => {
    if (!credentials.password || !credentials.username) return
    if (!isSame) return
    let pass_regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,31}$/ // 8 to 31 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
    if (!credentials.password.match(pass_regexp)) {


    }
    if (stage === 0) {
        fetch(config.server_url + 'api/register', {
        method: 'POST',
        body: JSON.stringify({...credentials, key: key.public_key}),
        headers: {
            'Content-Type': 'application/json',
        },
        })
            .then((res) => res.json())
            .then((res) => {
            if (res.statusCode !== 200) {
                alert(res.message)
            } else {
                localStorage.setItem('token', res.token)
                setStage(1)
            }
            })
        }
        else {
          if (key.private_key != null) {
              localStorage.setItem('key', key.private_key)
              if (localStorage.getItem('key')) setStage(2)
          }
        }
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
  const keyInput = useRef(null)
  const secondStage = () => {
    localStorage.setItem('key', key.private_key)
    if (stage === 1) return (
        <>
          <h3>One more thing</h3>
          <h4>Please, write down your private key!</h4>
          <div className={'register_main__form___key-wrapper'}>
          <input key={key.private_key} name={'key'} type={'text'} defaultValue={key.private_key} className={'register_main__form___key-wrapper'} ref={keyInput}></input>
          <span className="material-icons outlined register_main__form___copy" onClick={(e) => {
            if (keyInput.current){
              //@ts-ignore
              keyInput.current.select()
            } 
            document.execCommand("copy")
          }}>
            content_copy
          </span>
          </div>
          <button type={'submit'} className={'register_main__form___submit'}>Create account</button>
        </>
    )
    else return <Redirect to={'/'} />
  }
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetch(config.server_url + 'api/checkAuth', {
        method: 'POST',
        body: JSON.stringify({token: localStorage.getItem('token')}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
          .then((res) => res.json())
          .then((res) => {
            if (res.statusCode === 200) {
              setLoading(false)
              setStage(2)
            }
          })
    }
    else {
      setLoading(false)
    }
  }, [])
  if (isLoading) return <Preloader />
  return <>
    <div className="register_main">
      <div className={'register_main__header'}>
          <h1 className={'register_main__header___title'}>Create your account</h1>
          <h2 className={'register_main__header___undertitle'}>If you already have an account, login using button below</h2>
      </div>
      <div className={'register_main__block'}>
        <form className={'register_main__form'} onSubmit={(e) =>{
          e.preventDefault()
          handleRegister(credentials, stage, setStage)
        }}>
          {stage ? secondStage() : firstStage()}
        </form>
      </div>
    </div>
  </>

}

export default Register
