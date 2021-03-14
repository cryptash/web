import SidebarHeader from "./Header/Header"
import './Sidebar.scss'
import ChatList from "./ChatList/ChatList"
import { useUser } from "../../../Contexts/UserContext"

const Sidebar = (props: {
}) => {
  const {state} = useUser()
  return <>
    <div className={'chat_sidebar'}>
      <SidebarHeader user={{username: state.username, picture: state.picture}} />
      <ChatList />
    </div>
  </>
}
export default Sidebar;