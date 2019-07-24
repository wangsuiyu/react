// 引入合并多个reducer的方法combineReducers
import { combineReducers } from 'redux'
import { cartReducer } from './cartReducer'
import { userReducer } from './userReducer'

let rootReducer = combineReducers({
  cartReducer,
  userReducer
})
export default rootReducer