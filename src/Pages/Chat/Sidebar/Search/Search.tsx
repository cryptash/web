import config from '../../../../config'
import { useSearch } from '../../../../Contexts/SearchReducer'
import { useUser } from '../../../../Contexts/UserContext'
import './Search.scss'
import {useRef} from "react";

const SidebarSearch = (props: {
  isOpened: boolean,
  setOpened: (s: boolean) => void
}) => {
  const search = useSearch()
  const input = useRef<HTMLInputElement>(null)
  const handleSearch = (e: {target: {value: string}}) => {
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
    if (localStorage.getItem('token')) {
      const headers = new Headers({
        'Content-Type': 'application/json',
      })
      headers.append( 'Authorization', `${localStorage.getItem('token')}`)
      fetch(config.server_url + 'api/users/search', {
        method: 'POST',
        body: JSON.stringify({
          query: e.target.value,
        }),
        headers,
      })
      .then((res) => res.json())
      .then((res: {statusCode: number, message?: string, data?: {users: Array<{
        username: string
        picture: string
        user_id: string
    }>}}) => {
        if (res.statusCode !== 200) {
          alert(res.message)
        } else {
          if (res.data)
            search.dispatch({
              type: 'CHANGE_CHATS',
              payload: {chats: res.data.users}
            })
        }
      })
    }
  }
  return (<>
    <div className={'chat_sidebar__search'}>
      <div className={'chat_sidebar__search___bar'} onClick={(e) => {
        if (!props.isOpened) {
          props.setOpened(true)
          if (input.current !== null) {
            setTimeout(() => {if (input.current !== null) input.current.focus()}, 100)
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