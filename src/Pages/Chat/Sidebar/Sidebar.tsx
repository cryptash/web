import SidebarHeader from "./Header/Header"
import './Sidebar.scss'
import {UserState} from '../../../Typings/UserState'
import ChatList from "./ChatList/ChatList"

const Sidebar = (props: {
  user: UserState
}) => {
  const {user} = props
  return <>
    <div className={'chat_sidebar'}>
      <SidebarHeader user={{username: user.username,picture: user.picture}} />
      <ChatList chats={props.user.chats} pub_key={props.user.pub_key}/>
    </div>
  </>
}
export default Sidebar;