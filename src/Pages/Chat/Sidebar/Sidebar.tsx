import SidebarHeader from "./Header/Header"
import './Sidebar.scss'
import ChatList from "./ChatList/ChatList"
import { useUser } from "../../../Contexts/UserContext"
import SidebarSearch from "./Search/Search"
import { SearchProvider } from "../../../Contexts/SearchReducer"

const Sidebar = (props: {
}) => {
  const {state} = useUser()
  return <>
  <SearchProvider>
    <div className={'chat_sidebar'}>
      <SidebarHeader user={{username: state.username, picture: state.picture}} />
      <SidebarSearch />
      <ChatList />
    </div>
  </SearchProvider>
  </>
}
export default Sidebar;