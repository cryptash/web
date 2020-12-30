import React, {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import './Login.scss';
import Preloader from "../../Components/Preloader/Preloader";

const handleLogin = (credentials: {
  username?: string,
  password?: string,
  key?:string
}, stage: number, setStage: any) => {
  if (stage === 0) {
  fetch('http://' + 'localhost:9000' + '/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode !== 200) {
          alert(res.message)
        } else {
          console.log(res)
          localStorage.setItem('token', res.token)
          setStage(1)
        }
      })
  }
  else {
    if (credentials.key != null) {
      localStorage.setItem('key', credentials.key)
      if (localStorage.getItem('key')) setStage(2)
    }
  }
}

const Login: React.FunctionComponent = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    key: ''
  })
  const [stage, setStage] = useState(0)
  const [isLoading, setLoading] = useState(true)
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
                 onChange={(e:any) => {
                   console.log(e.target.value)
                   setCredentials({
                     ...credentials,
                     key: e.target.value,
                  })}
                 }
          />
          <button type={'submit'} className={'login_main__form___submit'}>Login</button>
        </>
    )
    else return <Redirect to={'/'} />
  }
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
    <div className="login_main">
      <div className={'login_main__header'}>
          <h1 className={'login_main__header___title'}>Sign in into your account</h1>
          <h2 className={'login_main__header___undertitle'}>If you don't have account, sign up using button below</h2>
      </div>
      <div className={'login_main__block'}>
        <form className={'login_main__form'} onSubmit={(e) =>{
          e.preventDefault()
          handleLogin(credentials, stage, setStage)
        }}>
          {stage ? secondStage() : firstStage()}
        </form>
      </div>
    </div>
  </>

}

export default Login
