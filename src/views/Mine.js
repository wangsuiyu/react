import React, { Component } from 'react'
import { Card, Button } from 'antd-mobile'
import {connect} from 'react-redux'

export class Mine extends Component {
  handleLogout = () => {
    // 将登录状态置为false，并跳转到首页
    this.props.changeState(false)
    this.props.history.push('/')
  }
  
  render() {
    return (
      <div>
        <Card>
          <Card.Header
            title="Rose"
            thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
            extra={<span>UI设计</span>}
          />
          <Card.Body>
            <div>已入行两年</div>
          </Card.Body>
          <Card.Footer content="996" extra={<div>没有男朋友</div>} />
        </Card>
        <Button type="warning" onClick={this.handleLogout}>退出登录</Button>
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


export default connect(null, mapActionToProps)(Mine)
