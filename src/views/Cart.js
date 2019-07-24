import React, { Component, Fragment } from 'react'
// 这里引入图片不能简单的通过相对路径的写法去写，只能通过这方式去实现
import emptyCart from '../assets/imgs/cart_empty.png'
import { SwipeAction, Checkbox } from 'antd-mobile'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
const CheckboxItem = Checkbox.CheckboxItem;

export class Cart extends Component {
  render() {
    return (
      <div className="cart">
        {/* 购物车为空的模板 */}
        {
          this.props.cartList.length === 0
          ? <div className="empty-cart">
              <img src={emptyCart} alt="" className="empty-cart-img"/>
              <div className="empty-cart-text">当前购物车为空</div>
              <div className="btn" onClick={() => this.props.history.push('/')}>去选购</div>
            </div>
          : <Fragment>
          <div className="wrap">
            {
              this.props.cartList.map(item => (
                <div className="cart-container" key={item.id}>
                  <SwipeAction
                    style={{ backgroundColor: 'gray' }}
                    autoClose
                    right={[
                      {
                        text: '取消',
                        onPress: () => console.log('cancel'),
                        style: { backgroundColor: '#ddd', color: 'white' },
                      },
                      {
                        text: '删除',
                        onPress: () => this.props.deleteItem(item.id),
                        style: { backgroundColor: '#F4333C', color: 'white' },
                      },
                    ]}
                    onOpen={() => console.log('global open')}
                    onClose={() => console.log('global close')}
                  >
                    <CheckboxItem
                        checked={item.selectStatus}
                        onChange={() => this.props.updateItemStatus(item.id)}
                    >
                      <div className="item-detail">
                        <img src={item.img} alt={item.title}/>
                        <div className="item-info">
                          <h3>{item.title}</h3>
                          <div className="pay">
                            <div className="pay-price">￥ {item.price}</div>
                            <div className="edit-quantity">
                              <p className="operate-btn iconfont icon-minus" onClick={() => this.props.updateItemNum(item.id, -1)}></p>
                              <p className="btn-input">{item.num}</p>
                              <p className="operate-btn iconfont icon-plus" onClick={() => this.props.updateItemNum(item.id, 1)}></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CheckboxItem>
                  </SwipeAction>
                </div>
              ))
            }
          </div>
          <div className="cart-footer">
            <div className="cart-footer-left">
              <CheckboxItem
                checked={this.props.allStatus}
                onChange={() => this.props.updateAllStatus(this.props.allStatus)}
              >全选</CheckboxItem>
            </div>
            <div className="cart-footer-center">
              <span>合计</span>
              <span className="total-price">￥{this.props.price}</span>
            </div>
            <div className="cart-footer-right" onClick={() => this.props.history.push('/pay')}>
              <span className="goto-pay">去结算({this.props.num})</span>
            </div>
          </div>
        </Fragment>
        }
        <style jsx>{`
          .cart {
            padding-bottom: 50px;
            min-height: 100%;
            font-size: 14px;
            .empty-cart {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-top: 100px;
              height: 100%;
              .empty-cart-img {
                height: 90px;
                width: 90px;
              }
              .empty-cart-text {
                font-size: 20px;
                color: #999;
                padding: 15px 0;
              }
              .btn {
                font-size: 20px;
                padding: 15px 55px;
                text-align: center;
                margin: 0 auto;
                border-radius: 10px;
                background: #ed601b;
                color: #fff;
              }
            }
            .item-detail {
              display: flex;
              img {
                margin: 2px 0 2px 5px;
                width: 90px;
                height: 90px;
              }
              .item-info {
                padding: 5px 10px;
                display: flex;
            flex: 1;
                flex-direction: column;
                justify-content: space-around;
            white-space: normal;
                h3 {
                  font-size: 16px;
                  font-weight: 400;
                }
                .pay {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 25px;
                  .pay-price {
                    color: #ff5500;
                    font-weight: bold;
                  }
                  .edit-quantity {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .operate-btn {
                      padding: 0 10px;
                      font-size: 20px;
                      color: #bababa;
                    }
                    .btn-minus {
                      font-size: 14px;
                    }
                  }
                }
              }
            }
            .cart-footer {
              position: fixed;
              bottom: 50px;
              display: flex;
              justify-content: space-between;
              height: 50px;
              line-height: 50px;
              width: 100%;
              border-top: 1px solid #e7e7e7;
              background-color: #fff;
              .cart-footer-left {
                display: flex;
                justify-content: cneter;
                align-items: center;
                span {
                  display: block;
                  height: 50px;
                  padding: 0 5px;
                }
              }
              .cart-footer-center {
                .total-price {
                  color: #ff5500;
                  font-weight: bold;
                }
              }
              .cart-footer-right {
                display: flex;
                flex-direction: column;
                padding: 0 20px;
                background-color: #ff5500;
                .goto-pay {
                  color: #fff;
                }
              }
            }
          }
          `}</style>
      </div>
    )
  }
}
// 获取总数量
const getTotalNum = (arr) => {
  let total = 0
  arr.map(item => {
    if (item.selectStatus) {
      total += item.num
    }
  })
  return total
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
// 获取总的状态
const getAllStatus = (arr) => {
  let status = true
  arr.map(item => {
    // 只要商品项中有一个false，就将总的状态赋值为false
    if (!item.selectStatus) {
      status = false
    }
  })
  return status
}

// 创建映射state的映射函数
const mapStateToProps = (state) => {
  return {
    cartList: state.cartReducer,
    num: getTotalNum(state.cartReducer), // 总数量
    price: getTotalPrice(state.cartReducer), // 总价
    allStatus: getAllStatus(state.cartReducer) // 所有状态
  }
}
// 创建映射action的映射函数
const mapActionToProps = (dispatch) => {
  return {
    // 更新商品状态
    updateItemStatus: (id) => {
      dispatch({type: 'UPDATE_ITEM_STATUS', payload: id})
    },
    // 更改商品数量
    updateItemNum: (id, unit) => {
      dispatch({type: 'UPDATE_ITEM_NUM', payload: {id, unit}})
    },
    // 删除商品
    deleteItem: (id) => {
      dispatch( {type: 'DELETE_ITEM', payload: id })
    },
    // 更新所有商品的状态
    updateAllStatus: (allStatus) => {
      // allStatus不能直接写成this.props.allStatus，这样写会拿不到props中的数据，得通过页面传递进来这个全选的状态
      dispatch({type: 'UPDATE_ALL_STATUS', payload: allStatus})
    }
  }
}



export default connect(mapStateToProps, mapActionToProps)(withRouter(Cart))
