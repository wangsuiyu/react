import React, { Component } from 'react'
import { connect } from 'react-redux'
import PrivateRoute from '../components/PrivateRoute'
import Mine from './Mine'

export class Container extends Component {
  render() {
    // PrivateRoute需要传递path（表示最终目的要跳转到哪个路径） / component （最终那个路径要渲染出来的组件） / loginState（获取到的当前的登录状态）作为属性
    return (
      <PrivateRoute path="/mine" component={Mine} loginState={this.props.loginState}></PrivateRoute>
    )
  }
}
// 新建映射userReducer中loginState的函数
const mapStateToProps = (state) => {
  return {
    // 取出userReducer中保存的登录状态的值放入loginState属性中
    loginState: state.userReducer.loginState
  }
}


export default connect(mapStateToProps)(Container)
