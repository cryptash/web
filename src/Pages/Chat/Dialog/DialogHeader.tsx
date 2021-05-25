import UserPicture from "../../../Components/UserPicture/UserPicture";
import {FunctionComponent} from "react";

const DialogHeader: FunctionComponent<{
  username: string,
  picture: string
}> = (props) => {
  console.log(props)
  return <>
    <div className={'chat_dialog__header'}>

      <UserPicture picture={props.picture} username={props.username} />
    </div>
  </>
}

export default DialogHeader