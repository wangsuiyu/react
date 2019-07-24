import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FastClick from 'fastclick';
// 引入全局样式文件
import './styles/index.css'
import store from './store'
// 引入Provider组件将store实例注入到应用程序中
import { Provider } from 'react-redux'

FastClick.attach(document.body);

ReactDOM.render(<Provider store={store}>
  <App />
</Provider>, document.getElementById('root'));
