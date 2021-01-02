import UserPicture from "../../../../Components/UserPicture/UserPicture"
import './Header.scss'

const SidebarHeader = (props: {
  user: {
    username: string,
    picture: string
  }
}) => {
  return (<>
    <div className={'chat_sidebar__header'}>
      <UserPicture username={props.user.username} picture={props.user.picture}/>
      <span className={'chat_sidebar__header___username'}>{props.user.username}</span> 
    </div>
    
  </>)
}
export default SidebarHeader