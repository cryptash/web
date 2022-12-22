import { useNavigate } from 'react-router-dom'
import UserPicture from '../../../../Components/UserPicture/UserPicture'
import './Header.scss'

const SidebarHeader = (props: {
  user: {
    username: string
    picture: string
  }
  setOpen: () => void
}) => {
  const navigate = useNavigate()
  return (
    <>
      <div
        className={'chat_sidebar__header'}
        onClick={(_: any) => {
          if (window.innerWidth < 900)
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
              navigate('/login')
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
