import React, { Component } from 'react'
import { NavBar, Icon, Carousel } from 'antd-mobile'
// 引入connect
import {connect} from 'react-redux'
// 引入请求方法
import { getGoodsDetail } from '../api'
export class Goodsdetail extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      sliderList: [], // 轮播图图片数组
      imgHeight: 375,
      goodsDetail: {} // 商品详情数据
    }
  }
  componentDidMount() {
    getGoodsDetail(this.props.match.params.id)
      .then(res => {
        console.log(res)
        this.setState({
          sliderList: res.data.message.imglist,
          goodsDetail: res.data.message.goodsinfo
        })
      })
  }
  
  render() {
    return (
      <div>
        {/* 
          头部
          this.props.history.go(-1)表示返回上一级目录
        */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.go(-1)}
        >商品详情</NavBar>

        {/* 轮播图 */}
        <Carousel
          autoplay={true}
          infinite
        >
          {this.state.sliderList.map(item => (
            <div
              key={item.id}
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={item.thumb_path}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </div>
          ))}
        </Carousel>

        {/* 商品详情中间内容 */}
        <div className="goods-container">
          <h4 className="goods-title">{this.state.goodsDetail.title}</h4>
          <h3>{this.state.goodsDetail.sub_title}</h3>
          <p className="goods-price">
            <span className="market-price">{this.state.goodsDetail.market_price}</span>
            <span className="sell-price">{this.state.goodsDetail.sell_price}</span>
          </p>
          <div className="goods-info">
            <h4 className="goods-desc">商品参数</h4>
            <p>商品编号：{this.state.goodsDetail.goods_no}</p>
            <p>库存：{this.state.goodsDetail.stock_quantity}</p>
            <p>上架时间：{this.state.goodsDetail.add_time}</p>
          </div>
          {/* 渲染带html标签的字符串使用属性: dangerouslySetInnerHTML */}
          <p dangerouslySetInnerHTML={{__html: this.state.goodsDetail.content}}></p>
        </div>

        {/* 商品详情的footer */}
        <div className="goods-footer">
          <div className="goods-footer-item contact">
            <span className="iconfont icon-kefu"></span>
            <span>客服</span>
          </div>
          <div className="goods-footer-item cart" onClick={() => this.props.history.push('/cart')}>
            <span className="iconfont icon-gouwuche"></span>
            <span>
              <span className="badge">{this.props.num}</span>
              购物车
            </span>
          </div>
          <div className="goods-footer-item add" onClick={() => this.props.addItem(this.state.goodsDetail)}><span>加入购物车</span></div>
          <div className="goods-footer-item buy" onClick={() => this.props.history.push('/cart')}><span>立即购买</span></div>
        </div>
        <style jsx>{`
          .goods-container {
            margin-bottom: 49px;
          }
          .goods-title {
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
          }

          .goods-price {
            font-size: 14px;

            .market-price {
              text-decoration: line-through;
            }

            .sell-price {
              color: #e4393c;
            }
          }

          .goods-info {
            font-size: 14px;

            .goods-desc {
              margin-top: 10px;
              font-size: 16px;
              font-weight: bold;
            }
          }
          .goods-footer {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            height: 50px;
            width: 100%;
            border-top: 1px solid #e7e7e7;
            background-color: #fff;

            .goods-footer-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }

            .contact,
            .cart {
              width: 40%;
              font-size: 12px;
              position: relative;
            }

            .badge {
              position: absolute;
              top: 3%;
              left: 50%;
              width: 14px;
              height: 14px;
              border-radius: 7px;
              background-color: #e4393c;
              text-align: center;
              line-height: 14px;
              color: white;
            }

            .add,
            .buy {
              width: 60%;
              color: white;

              &>span {
                font-size: 20px;
              }
            }

            .add {
              background-color: #ff976a;
            }

            .buy {
              background-color: #ff4444;
            }
          }
        `}</style>
      </div>
    )
  }
}

// 创建一个遍历state.cartReducer数组的函数，将数组中selectStatus为true的选项的num累加起来就行了
const getTotalNum = (arr) => {
  let total = 0
  arr.map(item => {
    if (item.selectStatus) {
      total += item.num
    }
  })
  return total
}

// 创建映射action的函数
const mapActionToProps = (dispatch) => {
  return {
    addItem: (goodsDetail) => {
      dispatch({type: 'ADD_ITEM', payload: goodsDetail})
    }
  }
}


// 创建一个获取redux中state的映射函数
const mapStateToProps = (state) => {
  return {
    num: getTotalNum(state.cartReducer)
  }
}


export default connect(mapStateToProps, mapActionToProps)(Goodsdetail)
