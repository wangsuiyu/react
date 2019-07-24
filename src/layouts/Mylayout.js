import React, { Component } from 'react'
// 1.1 引入TabBar组件
import { TabBar } from 'antd-mobile';
export class Mylayout extends Component {
  render() {
    return (
      <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
      >
        {/*
          unselectedTintColor: 未选中的字体颜色
          tintColor: 选中的字体颜色
          barTintColor: tabbar 背景色
        */}
        {/*
          TabBar.Item表示TabBar组件中的每一项
          title：标题文字
          key: 唯一标识
          icon: 默认展示图片
          selectedIcon: 选中后的展示图片
          selected: 是否选中
          badge: 徽标数
          onPress: bar 点击触发
          */}
        {/* 
          selected选中高亮通过location.pathname动态判断
          onPress点击时只需要改变路由规则
         */}
        <TabBar.Item
          title="Home"
          key="Home"
          icon={<i className="iconfont icon-home"></i>}
          selectedIcon={<i className="iconfont icon-home" style={{color: '#33A3F4'}}></i>}
          selected={this.props.location.pathname === '/'}
          onPress={() => this.props.history.push('/')}
        >
          {this.props.children}
        </TabBar.Item>
        <TabBar.Item
          title="Cart"
          key="Cart"
          icon={<i className="iconfont icon-gouwuche"></i>}
          selectedIcon={<i className="iconfont icon-gouwuche" style={{color: '#33A3F4'}}></i>}
          selected={this.props.location.pathname === '/cart'}
          badge={1}
          onPress={() => this.props.history.push('/cart')}
        >
          {this.props.children}
        </TabBar.Item>
        <TabBar.Item
          title="Mine"
          key="Mine"
          icon={<i className="iconfont icon-weibiaoti2fuzhi12"></i>}
          selectedIcon={<i className="iconfont icon-weibiaoti2fuzhi12" style={{color: '#33A3F4'}}></i>}
          selected={this.props.location.pathname === '/mine'}
          onPress={() => this.props.history.push('/mine')}
        >
          {this.props.children}
        </TabBar.Item>
      </TabBar>
    )
  }
}

export default Mylayout
