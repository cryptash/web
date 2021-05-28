export interface ChatResponse {
  chat_id?: string
  messageAt?: Date
  user: {
    user_id: string
    pub_key?: string
    picture: string
    username: string
  }
  messages: Array<{
    content: string
    fromMe: boolean
    date: Date
    read: boolean
    message_id: string
  }>
}
