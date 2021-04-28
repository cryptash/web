import SidebarHeader from "./Header/Header"
import './Sidebar.scss'
import ChatList from "./ChatList/ChatList"
import { useUser } from "../../../Contexts/UserContext"
import SidebarSearch from "./Search/Search"
import { SearchProvider } from "../../../Contexts/SearchReducer"
import {useScreen} from "../../../Contexts/ScreenContext";
import {useEffect, useState} from "react";

const Sidebar = (props: {
}) => {
  const {state} = useUser()
  const screen = useScreen()
  const [isOpened, setOpen] = useState(screen.state.width > 700)
  useEffect(() => {
    setOpen(screen.state.width > 700)
  }, [screen.state]);

  return <>
  <SearchProvider>
    <div className={`chat_sidebar ${isOpened ? 'opened' : 'closed'}`}>
      <SidebarHeader user={{username: state.username, picture: state.picture}} setOpen={() => {
        console.log(!isOpened)
        setOpen(!isOpened)
      }}/>
      <SidebarSearch isOpened={isOpened} setOpened={(_: boolean) => setOpen(_)} />
      <ChatList />
    </div>
  </SearchProvider>
  </>
}
export default Sidebar;