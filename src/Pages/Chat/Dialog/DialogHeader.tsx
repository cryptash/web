import UserPicture from '../../../Components/UserPicture/UserPicture'
import { FunctionComponent } from 'react'
import './DialogHeader.scss'

const DialogHeader: FunctionComponent<{
  username: string
  picture: string
  status: string
}> = (props) => {
  const generateStatus = () => {
    switch (props.status) {
      case 'OFFLINE': {
        return <>
          <div className={'oval grey'}></div>
          <span>Offline</span>
        </>
        break
      }
      case 'ONLINE': {
        return <>
          <div className={'oval green'}></div>
          <span>Online</span>
        </>
      }
    }
  }
  return (
    <>
      <div className={'chat_dialog__header'}>
        <section className={'chat_dialog__header___picture'}>
          <UserPicture picture={props.picture} username={props.username} />
        </section>
        <section className={'chat_dialog__header___info'}>
          <span className={'chat_dialog__header___info-username'}>{props.username}</span>
          <div className={'chat_dialog__header___info-status'}>{generateStatus()}</div>
        </section>
      </div>
    </>
  )
}

export default DialogHeader
