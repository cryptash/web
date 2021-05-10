import { CrossTabClient, log } from '@logux/client'
import { createStoreCreator } from '@logux/redux'
import config from "../config";
import rootReducer from "../Reducers";

let userId = localStorage.getItem('user_id') || 'anonymous'
let token = localStorage.getItem('token') || ''

const client = new CrossTabClient({
  subprotocol: '1.0.0',
  server: config.socket_url,
  userId,
  token
})

const createStore = createStoreCreator(client)

const store = createStore(rootReducer)
log(store.client)

export default store