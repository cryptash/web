import { useEffect, useMemo, useState } from "react"
import { decryptMessage } from "../../../Utils/decrypt"

const Message: React.FunctionComponent<{
  content: string
  pub_key: string
  date: Date
  fromMe: boolean
}> = (props) => {
  let content:string = ''
  try {
    content = decryptMessage(localStorage.getItem('key'), props.content, props.pub_key).text
    
  } catch (error) {
    console.log(error)
  }
  return <>
    <div className={`chat_dialog__messages___bubble ${props.fromMe ? 'fromMe' : 'toMe'}`}>
      {content}
    </div>
  </>
}

export default Message