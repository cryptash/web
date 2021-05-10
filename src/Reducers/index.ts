import {userReducer} from "./UserReducer";

import { combineReducers, Reducer } from "redux";
import actionCreatorFactory, { isType } from "typescript-fsa";
import {chatReducer} from "./ChatReducer";

const actionCreator = actionCreatorFactory();

export const changeChat = actionCreator<{ id: string }>("chat/change");
export type changeChatAction = ReturnType<typeof changeChat>;
export const setChatId = actionCreator<{ id: string }>("chat/set_id");
export type setChatIdAction = ReturnType<typeof setChatId>;

export const getMessages = actionCreator<{ pg: number, chat_id: string }>("chat/messages/get");
export type getMessagesAction = ReturnType<typeof getMessages>;

export const sendMessage = actionCreator<{
  content: string,
  from: string
  chat_id: string
}>("chat/messages/send");
export type sendMessage = ReturnType<typeof sendMessage>;

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
  | sendMessage


const rootReducer = combineReducers({
  userReducer,
  chatReducer
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>;