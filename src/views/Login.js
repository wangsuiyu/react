import React, { Component } from 'react'
import { List, InputItem, Toast, Button, WingBlank, WhiteSpace } from 'antd-mobile'
// rc-form中提供了表单校验相关的接口
import { createForm } from 'rc-form'
import { login } from '../api'
import {connect} from 'react-redux'

export class Login extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      username: '',
      password: ''
    }
  }
  handleLogin = () => {
    // js校验
    this.props.form.validateFields((error, value) => {
      if (error) {
        Toast.fail('请填写正确的表单数据', 2)
      } else {
        // 登录的请求
        login({
          user_name: this.state.username,
          password: this.state.password
        })
          .then(res => {
            if (res.data.status === 0) {
              // 登录成功后跳转到我的页面, 当然只有用户在PrivateRoute中传递了state才能跳转到Mine页面，如果没有传递，只能跳转到首页
              let { from } = this.props.location.state || { from: { pathname: "/" } };
              // 修改登录状态
              this.props.changeState(true)
              // 跳转
              this.props.history.push(from.pathname)
            } else {
              // 登录失败
              Toast.fail(res.data.message)
            }
          })
      }
    })
  }

  // 去注册
  goToRegister = () => {
    this.props.history.push('/register')
  }
  
  render() {
    // 从form属性中取出getFieldProps, getFieldError
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div>
        <List style={{ backgroundColor: 'white' }}>
          <InputItem
              placeholder="请输入用户名"
              error={getFieldError('username') ? true : false}
              onErrorClick={() => Toast.fail('用户名不能为空', 2)}
              {
              ...getFieldProps('username', {
                  validateTrigger: ['onBlur'],
                  rules: [{required: true}]
                })
              }
              value={this.state.username}
              onChange={(e) => this.setState({username: e})}
            ><span style={{color: 'red'}}>*</span>用户名</InputItem>
          <InputItem
              placeholder="请输入密码"
              type="password"
              error={getFieldError('password') ? true : false}
              onErrorClick={() => Toast.fail('密码不能为空', 2)}
              {
              ...getFieldProps('password', {
                  validateTrigger: ['onBlur'],
                  rules: [{required: true}]
                })
              }
              value={this.state.password}
              onChange={(e) => this.setState({password: e})}
            ><span style={{color: 'red'}}>*</span>密码</InputItem>
        </List>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Button type="primary" onClick={this.handleLogin}>立即登录</Button>
          <WhiteSpace size="lg" />
          <Button onClick={this.goToRegister}>去注册</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapActionToProps = (dispatch) => {
  return {
    changeState: (newState) => {
      dispatch({type: 'CHANGE_STATE', payload: newState})
    }
  }
}


export default connect(null, mapActionToProps)(createForm()(Login))
