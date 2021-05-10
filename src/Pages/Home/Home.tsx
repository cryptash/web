import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import Preloader from "../../Components/Preloader/Preloader";
import config from '../../config'
import {useSubscription} from "@logux/redux";
import { UserProvider } from '../../Contexts/UserContext';
import Chat from '../Chat/Chat';
import {Client} from "@logux/client";
import {changeChat, getMessages, RootState, sendMessage, setChatId} from "../../Reducers";
import {LoguxDispatch} from "@logux/redux/create-store-creator";
import {Action} from "redux";
import {connect, ConnectedProps} from "react-redux";

const mapStateToProps = (state: RootState) => {
  return {
    user: state.userReducer,
    chat: state.chatReducer
  };
};

const mapDispatchToProps = (dispatch: LoguxDispatch<Action>) => ({
  changeChat: (id: string) => {
    dispatch(changeChat({ id }))
  },
  getMessages: (pg: number, chat_id: string) => {
    dispatch(getMessages({ pg, chat_id }))
  },
  setChatId: (id: string) => {
    dispatch(setChatId({ id }))
  },
  sendMessage: (content: string, chat_id: string, from: string) => {
    dispatch.sync(sendMessage({content, chat_id, from}))
  }
});
const connector = connect(mapStateToProps, mapDispatchToProps as any);
export type Props = ConnectedProps<typeof connector>;
const Home: React.FunctionComponent<Props> = (props) => {
  const [isLoggined, setLoginned] = useState(0)
  const token = localStorage.getItem('token')
  // Check if authenticated
  useEffect(() => {
    if (localStorage.getItem('token')) {
      let client = new Client({
        subprotocol: '1.0.0',
        server: config.socket_url,
        userId: 'anonymous'
      })
      client.on('add', (action: any) => {
        if (action.type === 'user/check/done') {
          setLoginned(2)
        } else if (action.type === 'logux/undo') {
          setLoginned(0)
        }
      })
      client.start()
      client.log.add({ type: 'user/check', token: localStorage.getItem('token')}, { sync: true })
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
    <Chat {...props}/>
  </UserProvider>
  )
  
}

export default connector(Home);
