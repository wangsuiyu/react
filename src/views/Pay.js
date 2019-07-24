import React, { Component } from 'react'
import { NavBar, Icon, List, Picker, InputItem, Toast, TextareaItem, Checkbox, Button, Modal } from 'antd-mobile'
import { district } from 'antd-mobile-demo-data'
// rc-form中提供了表单校验相关的接口
import { createForm } from 'rc-form'
import { connect } from 'react-redux'
import { setOrder, getCodeurl, queryStatus } from '../api'
import QRCode from 'qrcode'

const CheckboxItem = Checkbox.CheckboxItem

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export class Pay extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      modal1: false, // 支付二维码弹出框默认隐藏
      // 快递类型，value表示选中某个值发送给后台的数据值，label展示出来到页面的汉字
      expressType: [
        {
          value: '1',
          label: '顺丰'
        },
        {
          value: '2',
          label: '圆通'
        },
        {
          value: '3',
          label: '韵达'
        }
      ], // √
      disstrictVal: [], // 获取地区渲染的数组 √
      goodsAmount: 0, // 商品总额 √
      expressMoment: 0, // 快递费 √
      accept_name: '', // 收货人 √
      address: '', // 收获详细地址 √
      mobile: '', // 收货人电话号码 √
      email: '', // 收货人邮箱地址 √
      post_code: '', // 收货人邮编 √
      payment_id: 6, // 支付方式在线支付, 为默认不可更改 √
      express_id: '1', // 运送方式 1：顺丰  2：圆通 3：韵达（可更改） √
      message: '', // 订单备注信息 √
      goodsids: '', // 购买商品的id，多个之间用逗号隔开 √  '99, 93'
      cargoodsobj: '', // 购买商品对象，商品id为key，购买数量为值 √ {'99': 1, '93': 1}
      area: {
        province: {
          code: ''
        }, // 省
        city: {
          code: ''
        }, // 市
        area: {
          code: ''
        } // 区
      }
    }
  }

  // 查询订单支付状态的函数
  queryOrderStatus = (obj, timer) => {
    // 调用查询接口
    queryStatus(obj)
      .then(res => {
        // 一旦返回的状态是支付成功，就把弹框隐藏掉，弹出支付成功的提示信息，清掉定时器，跳转到首页
        if (res.data.message.trade_state === 'SUCCESS') {
          this.setState({
            modal1: false
          }, () => {
            clearInterval(timer)
            // 将跳转的操作写到Toast的关闭后的回调里面
            Toast.success('支付成功', 2, () => {
              this.props.history.push('/')
            })
          })
        }
      })
  }

  // 确认支付
  confirmPay = () => {
    // console.log(this.props.price, this.props.ids, this.props.goodsobj)
    let tempObj = {
      ...this.state,
      goodsAmount: this.props.price + this.state.expressMoment,
      goodsids: this.props.ids,
      cargoodsobj: this.props.goodsobj,
      area: {
        province: {
          code: this.state.disstrictVal[0]
        }, // 省
        city: {
          code: this.state.disstrictVal[1]
        }, // 市
        area: {
          code: this.state.disstrictVal[2]
        } // 区
      }
    }
    // 发请求之前首先用js代码对页面输入的字段进行校验。这里校验需要用到rc-form组件绑定给Pay组件上的form属性中的validateFields方法，error表示一个对象，里面放的是校验的错误信息；value表示的是通过getFiledProps方法设置的属性所获取到的值
    this.props.form.validateFields((error, value) => {
      if (error) {
        // 校验没通过
        Toast.fail('请检查输入的数据是否正确', 2)
      } else {
        // 校验通过
        // 发送下单请求
        setOrder(tempObj)
          .then(res => {
            // 如果成功，就将返回的信息再发一个请求，去生成一个二维码的链接
            if (res.data.status === 0) {
              let tempObj = {
                amount: 1, // 总价1分钱
                order_id: res.data.message.orderid,
                order_no: res.data.message.orderno
              }
              // 获取支付的二维码连接
              getCodeurl(tempObj)
                .then(res => {
                  // 显示二维码
                  this.showModal('modal1')
                  // 获取canvas画布
                  let canvas = document.getElementById('canvas')
                  // 将链接code_url转换成二维码图片放到canvas画布中
                  QRCode.toCanvas(canvas, res.data.message.code_url, (error) => {
                    if (error) console.error(error)
                    // 这里需要一个监听动作，监听这个支付的状态是否完成，只要二维码图片弹出来，就一直监听，这就是所谓的轮询
                    let timer = setInterval(() => {
                      // 每秒去查一次订单支付状态
                      this.queryOrderStatus(res.data.message, timer)
                    }, 1000)
                    
                  })
                })
            } else {
              // 如果失败，就弹出一个提示信息
              Toast.fail(res.data.message)
            }
          })
      }
    });
  }
  // 显示弹框
  showModal = (key) => {
    this.setState({
      [key]: true,
    });
  }
  // 关闭弹框
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  // 修复ios上的滚动的bug
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  render() {
    // 从form属性中取出getFieldProps, getFieldError
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.go(-1)}
        >确认下单</NavBar>
        <List style={{ backgroundColor: 'white' }}>
          {/*
            extra 提示信息
            data 选择器使用的数据
            title 弹框上面的标题
            onOk 点击选中时执行的回调
            onDismiss 点击取消时执行的回调
           */}
          <Picker
            extra="请选择(必选)"
            data={district}
            title="地区"
            value={this.state.disstrictVal}
            onOk={e => this.setState({disstrictVal: e})}
            onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal"><span style={{color: 'red'}}>*</span>地区</List.Item>
          </Picker>

          {/* 
            error用来控制报错样式，不能写死，将来肯定需要根据校验动态添加
            onErrorClick点击错误图标的回调
            getFieldProps定义了一个用于校验的属性和当前的input进行绑定，validateTrigger设置了触发校验的方式，rules设置了校验的规则
            getFieldError方法用于获取getFieldProps定义的属性的校验信息，如果有错误信息就是一个字符串数组，如果没有就是一个undefined
            onChange和value必须写到getFieldProps下面，不然不会被触发⭐
           */}
          <InputItem
            placeholder="请输入详细地址"
            error={getFieldError('address') ? true : false}
            onErrorClick={() => Toast.fail('详细地址不能为空', 2)}
            {
            ...getFieldProps('address', {
                validateTrigger: ['onBlur'],
                rules: [{required: true}]
              })
            }
            value={this.state.address}
            onChange={(e) => this.setState({address: e})}
          ><span style={{color: 'red'}}>*</span>详细地址</InputItem>
          <InputItem
            placeholder="请输入收货人姓名"
            error={getFieldError('username') ? true : false}
            onErrorClick={() => Toast.fail('收货人不能为空', 2)}
            {
            ...getFieldProps('username', {
                validateTrigger: ['onBlur'],
                rules: [{required: true}]
              })
            }
            value={this.state.accept_name}
            onChange={(e) => this.setState({ accept_name: e })}
          ><span style={{color: 'red'}}>*</span>收货人</InputItem>
          <InputItem
            placeholder="请输入手机号"
            error={getFieldError('tel') ? true : false}
            onErrorClick={() => Toast.fail('手机号不能为空', 2)}
            {
            ...getFieldProps('tel', {
                validateTrigger: ['onBlur'],
                rules: [{required: true}]
              })
            }
            value={this.state.mobile}
            onChange={(e) => this.setState({mobile: e})}
          ><span style={{color: 'red'}}>*</span>手机号</InputItem>
          <InputItem
            placeholder="请输入邮箱"
            value={this.state.email}
            onChange={(e) => this.setState({email: e})}
          >邮箱</InputItem>
          <InputItem
            placeholder="请输入邮编"
            value={this.state.post_code}
            onChange={(e) => this.setState({post_code: e})}
          >邮编</InputItem>
          
          {/* 
            cols={1}表示当前的选择器只有1列
            Picker的值这里只能是数组，所以不能写value={this.state.express_id},只能在getFieldProps方法中通过配置对象的initialValue属性给当前的Piker添加默认值，指定这个默认值为一个数组，这个数组中的值，必须是expressType中的value的某个值
           */}
          <Picker
            {...getFieldProps('express', {
              initialValue: ['1']
            })}
            data={this.state.expressType}
            cols={1}
            extra="请选择(必选)"
            title="快递方式"
            onOk={e => this.setState({express_id: e[0]})}
            onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal">快递方式</List.Item>
          </Picker>

          <TextareaItem
            placeholder="请输入备注信息"
            rows={5}
            count={100}
            value={this.state.message}
            onChange={e => this.setState({message: e})}
          >

          </TextareaItem>

          <CheckboxItem disabled defaultChecked multipleLine>
            在线支付（默认不可更改）
          </CheckboxItem>
          <Button type="primary" onClick={this.confirmPay}>确认支付</Button>
        </List>
        {/* 二维码弹出框 */}
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={false}
          onClose={this.onClose('modal1')}
          title="微信支付"
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <canvas id="canvas"></canvas>
        </Modal>
      </div>
    )
  }
}

// 获取总的价格
const getTotalPrice = (arr) => {
  let total = 0
  arr.map(item => {
    if (item.selectStatus) {
      total += item.num * item.price
    }
  })
  return total
}
// 获取所有的id拼接成的字符串
const getTotalIds = (arr) => {
  let idsArr = []
  arr.map(item => {
    if (item.selectStatus) {
      // 把选中状态为true的数据的id保存到一个数组中，然后再根据这个数组拼接成一个字符串
      idsArr.push(item.id)
    }
  })
  return idsArr.join(',')
}
// 获取购买商品对象
const getGoodsObj = (arr) => {
  let obj = {}
  arr.map(item => {
    if (item.selectStatus) {
      obj[item.id] = item.num
    }
  })
  return obj
}


// 创建映射state的映射函数
const mapStateToProps = (state) => {
  return {
    price: getTotalPrice(state.cartReducer),
    ids: getTotalIds(state.cartReducer),
    goodsobj: getGoodsObj(state.cartReducer)
  }
}

// 使用createForm包裹组件，会让当前的组件上面绑定form属性，这个form属性中包含了校验相关的属性：getFieldProps, getFieldError
// getFieldProps 会创建一个属性，这个属性支持value和onChange事件
// getFieldError 就是用来获取input的校验的错误信息
export default connect(mapStateToProps)(createForm()(Pay))
