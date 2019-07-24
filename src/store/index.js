// 引入createStore方法创建容器对象store
import { createStore, applyMiddleware } from 'redux'
// 引入redux-logger中间件
import logger from 'redux-logger'
import rootReducer from './reducers'

let store = createStore(rootReducer, applyMiddleware(logger))

export default store