import { useHistory } from 'react-router-dom'
import UserPicture from '../../../../Components/UserPicture/UserPicture'
import './Header.scss'

const SidebarHeader = (props: {
  user: {
    username: string
    picture: string
  }
  setOpen: () => void
}) => {
  const history = useHistory()
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

        <span className={'material-icons outlined chat_sidebar__header___signout'} onClick={
          () => {
              localStorage.removeItem('key')
              localStorage.removeItem('token')
              localStorage.removeItem('user_id')
              history.push('/login')
              document.location.reload()
          }
        }>
          logout
        </span>
      </div>
    </>
  )
}
export default SidebarHeader
