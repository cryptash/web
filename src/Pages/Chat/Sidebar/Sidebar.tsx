import SidebarHeader from "./Header/Header"
import './Sidebar.scss'
import ChatList from "./ChatList/ChatList"
import SidebarSearch from "./Search/Search"
import { SearchProvider } from "../../../Contexts/SearchReducer"
import {useScreen} from "../../../Contexts/ScreenContext";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../Reducers";

const Sidebar = () => {
  const screen = useScreen()
  const user = useSelector((state: RootState) => state.userReducer)
  const [isOpened, setOpen] = useState(screen.state.width > 700)
  const [isOpenedByUser, setOpenedByUser] = useState(false)
  useEffect(() => {
    if (!isOpenedByUser)
      setOpen(window.innerWidth> 700)
  }, [screen.state.width]);
  return <>
  <SearchProvider>
    <div className={`chat_sidebar ${isOpened ? 'opened' : 'closed'}`}>
      <SidebarHeader user={{username: user.username, picture: user.picture}} setOpen={() => {
        setOpen(!isOpened)
        setOpenedByUser(!isOpenedByUser)
      }}/>
      <SidebarSearch isOpened={isOpened} setOpened={(_: boolean) => setOpen(_)} />
      <ChatList/>
    </div>
  </SearchProvider>
  </>
}
export default Sidebar;