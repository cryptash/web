import SidebarHeader from "./Header/Header"
import './Sidebar.scss'
import {UserState} from '../../../Typings/UserState'

const Sidebar = (props: {
  user: UserState
}) => {
  const {user} = props
  return <>
    <div className={'chat_sidebar'}>
      <SidebarHeader user={{username: user.username,picture: user.picture}} />

    </div>
  </>
}
export default Sidebar;