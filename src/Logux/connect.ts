import {changeChat, getMessages, RootState, sendMessage, setChatId} from "../Reducers";
import {LoguxDispatch} from "@logux/redux/create-store-creator";
import {Action} from "redux";
import {connect, ConnectedProps} from "react-redux";

const mapStateToProps = (state: RootState) => {
  return {
    user: state.userReducer,
    chat: state.chatReducer
  };
};

const mapDispatchToProps = (dispatch: LoguxDispatch<Action>) => ({
  changeChat: (id: string) => {
    dispatch(changeChat({ id }))
  },
  getMessages: (pg: number, chat_id: string) => {
    dispatch(getMessages({ pg, chat_id }))
  },
  setChatId: (id: string) => {
    dispatch(setChatId({ id }))
  },
  sendMessage: (content: string, chat_id: string, from: string) => {
    dispatch.sync(sendMessage({content, chat_id, from}))
  }
});
const connector = connect(mapStateToProps, mapDispatchToProps as any);
export type Props = ConnectedProps<typeof connector>;
export {connector}