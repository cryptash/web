import { useSearch } from '../../../../Contexts/SearchReducer'
import './Search.scss'
import {useEffect, useRef} from "react";
import {useDispatch} from "@logux/redux";
import {searchUsers} from "../../../../Reducers";
import store from "../../../../Logux/store";

const SidebarSearch = (props: {
  isOpened: boolean,
  setOpened: (s: boolean) => void
}) => {
  const search = useSearch()
  const input = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  useEffect(() => {
    store.client.log.type('users/search/done', (action: {
      type: 'users/search/done',
      payload: any
    }, _) => {
      search.dispatch({
        type: 'CHANGE_CHATS',
        payload: {chats: action.payload.users}
      })
    })
  }, [search]);

  const handleSearch = (e: {target: {value: string}}) => {
    console.log(e.target.value)
    search.dispatch({type: 'CHANGE_FILTER', payload: {
      type: 'users',
      filter: e.target.value
    }})
    if (e.target.value.length < 3) {
      search.dispatch({type: 'CHANGE_CHATS', payload: {
        chats: []
      }})
      return
    }
    dispatch.sync(searchUsers({query: e.target.value}))
  }
  return (<>
    <div className={'chat_sidebar__search'}>
      <div className={'chat_sidebar__search___bar'} onClick={(_) => {
        if (!props.isOpened) {
          if (input.current !== null) {
            setTimeout(() => {props.setOpened(true); if (input.current !== null) input.current.focus()}, 100)
          }
        }
      }}>
        <span className="material-icons outlined">
          search
        </span>
        <input type={'text'} className={'chat_sidebar__search___bar-input'} placeholder={'Search users'} ref={input} onChange={(e) => handleSearch(e)}/>
      </div>
    </div>
  </>)
}
export default SidebarSearch