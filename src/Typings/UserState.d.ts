import {ChatResponse} from './ChatReponse'
export interface UserState {
  username: string
  user_id: string
  pub_key: string
  picture: string
  chats: Array<ChatResponse>
  addMessageToChat: Function
}