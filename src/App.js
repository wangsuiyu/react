import React, { Component } from 'react';
import Home from './views/Home'
import Cart from './views/Cart'
import Mine from './views/Mine'
import Goodsdetail from './views/Goodsdetail'
import Pay from './views/Pay'
import Login from './views/Login'
import Register from './views/Register'
// 引入布局组件
import Mylayout from './layouts/Mylayout'
import Container from './views/Container'
// 引入和路由相关的组件
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
class App extends Component {
  render() {
    return (
      <Router>
        <div style={{ height: '100%' }}>
          <Switch>
            {/* 创建路由规则通过Route组件, 渲染路由规则的组件这里不能用component，得用render函数,render函数需要添加参数，目的是为了把路由对象的属性传递给Mylayout布局组件 */}
            <Route path='/' exact render={(props) => <Mylayout {...props}><Home></Home></Mylayout>}></Route>
            <Route path='/cart' render={(props) => <Mylayout {...props}><Cart></Cart></Mylayout>}></Route>
            <Route path='/mine' render={(props) => <Mylayout {...props}><Container></Container></Mylayout>}></Route>
            <Route path='/goodsdetail/:id' render={(props) => <Goodsdetail {...props}></Goodsdetail>}></Route>
            <Route path='/pay' render={(props) => <Pay {...props}></Pay> }></Route>
            <Route path='/login' render={ props => <Login {...props}></Login>}></Route>
            <Route path='/register' render={ props => <Register {...props}></Register>}></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
