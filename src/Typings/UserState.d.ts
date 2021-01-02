import {ChatResponse} from './ChatReponse'
export interface UserState {
  username: string
  user_id: string
  picture: string
  chats: Array<ChatResponse>
}