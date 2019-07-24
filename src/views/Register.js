import React, { Component } from 'react'
import { List, InputItem, Toast, Button, WingBlank, WhiteSpace } from 'antd-mobile'
// rc-form中提供了表单校验相关的接口
import { createForm } from 'rc-form'
import { checkUsername, register } from '../api'
export class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'admin',
      password: '123',
      email: 'we@qq.com',
      mobile: '17702361638'
    }
  }
  handleRegister = () => {
    // 执行注册逻辑
    this.props.form.validateFields((error, value) => {
      if (error) {
        Toast.fail('请检查填写数据是否正确', 2)
      } else {
        console.log('去注册')
        // 首先需要检查当前注册的用户名是否已存在，如果存在就弹出一个提示框；如果不存在采去注册
        checkUsername(this.state.username)
          .then(res => {
            // 根据res.data.message来判断是否已存在，true表示不存在 false表示已存在
            if(res.data.message) {
              // 不存在,直接注册
              register({
                ...this.state,
                user_name: this.state.username
              })
                .then(res => {
                  if (res.data.status === 0) {
                    // 注册成功，弹提示框，然后跳转到首页
                    Toast.success(res.data.message, 2, () => {
                      this.props.history.push('/')
                    })
                  } else {
                    // 注册失败
                    Toast.fail(res.data.message, 2)
                  }
                })
            } else {
              // 已存在，直接弹出提示
              Toast.fail('用户名已存在', 2)
            }
          })
      }
    })
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
            {/* 
              添加自定义的校验规则，需要再rules中添加一个validator属性，这个属性的值是一个校验函数，里面可以写一些校验规则。这个函数包含三个参数：rule/value表示输入的值/cb表示一个回调函数
             */}
          <InputItem
              placeholder="请输入邮箱"
              error={getFieldError('email') ? true : false}
              onErrorClick={() => Toast.fail('请检查邮箱是否正确', 2)}
              {
              ...getFieldProps('email', {
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    validator: function (rule, value, cb) {
                      if (value === '') {
                        cb('邮箱不能为空')
                      } else {
                        let emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}/
                        if (emailReg.test(value)) {
                          cb()
                        } else {
                          cb('请输入正确的邮箱格式')
                        }
                      }
                    }
                  }]
                })
              }
              value={this.state.email}
              onChange={(e) => this.setState({email: e})}
            ><span style={{color: 'red'}}>*</span>邮箱</InputItem>
          <InputItem
              placeholder="请输入电话号码"
              error={getFieldError('mobile') ? true : false}
              onErrorClick={() => Toast.fail('请检查电话是否正确', 2)}
              {
              ...getFieldProps('mobile', {
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    validator: function (rule, value, cb) {
                      if (value === '') {
                        cb('电话号码不能为空')
                      } else {
                        let mobilelReg = /^1[3|4|5|7|8][0-9]\d{4,8}$/
                        if (mobilelReg.test(value)) {
                          cb()
                        } else {
                          cb('请输入正确的电话格式')
                        }
                      }
                    }
                  }]
                })
              }
              value={this.state.mobile}
              onChange={(e) => this.setState({mobile: e})}
            ><span style={{color: 'red'}}>*</span>电话</InputItem>
        </List>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Button onClick={this.handleRegister}>注册</Button>
        </WingBlank>
      </div>
    )
  }
}

export default createForm()(Register)
