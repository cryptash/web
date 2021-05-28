import UserPicture from '../../../../Components/UserPicture/UserPicture'
import './Header.scss'

const SidebarHeader = (props: {
  user: {
    username: string
    picture: string
  }
  setOpen: () => void
}) => {
  return (
    <>
      <div
        className={'chat_sidebar__header'}
        onClick={(_: any) => {
          props.setOpen()
        }}
      >
        <UserPicture
          username={props.user.username}
          picture={props.user.picture}
        />
        <span className={'chat_sidebar__header___username'}>
          {props.user.username}
        </span>
      </div>
    </>
  )
}
export default SidebarHeader
