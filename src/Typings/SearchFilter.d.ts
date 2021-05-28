export interface SearchFilter {
  users: string
  messages: string
  chats: Array<{
    username: string
    picture: string
    user_id: string
  }>
}
