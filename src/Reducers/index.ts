import {userReducer} from "./UserReducer";

import { combineReducers } from "redux";
import actionCreatorFactory from "typescript-fsa";
import {chatReducer} from "./ChatReducer";

const actionCreator = actionCreatorFactory();

export const changeChat = actionCreator<{ id: string }>("chat/change");
export type changeChatAction = ReturnType<typeof changeChat>;
export const setChatId = actionCreator<{ id: string }>("chat/set_id");
export type setChatIdAction = ReturnType<typeof setChatId>;

export const getMessages = actionCreator<{ pg: number, chat_id: string }>("chat/messages/get");
export type getMessagesAction = ReturnType<typeof getMessages>;

export const setMessageRead = actionCreator<{ message_id: string, chat_id: string }>("chat/message/read");
export type setMessageReadAction = ReturnType<typeof setMessageRead>;

export const searchUsers = actionCreator<{ query: string }>("users/search");
export type searchUsersAction = ReturnType<typeof searchUsers>;

export const createChat = actionCreator<{ user_id: string }>("chat/create");
export type createChatAction = ReturnType<typeof createChat>;

export const sendMessage = actionCreator<{
  content: string,
  from: string | null
  chat_id: string
}>("chat/messages/send");
export type sendMessageAction = ReturnType<typeof sendMessage>;

export type SubscribeAction = { type: "logux/subscribe"; channel: string };
export const subscribe = (channel: string): SubscribeAction => ({
  type: "logux/subscribe",
  channel,
});

type Actions =
  changeChatAction
  | SubscribeAction
  | getMessagesAction
  | setChatIdAction
  | sendMessageAction
  | searchUsersAction


const rootReducer = combineReducers({
  userReducer,
  chatReducer
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>;