import React, { Component } from 'react'
// 引入antd-mobile的组件
import { Carousel, List } from 'antd-mobile'
// 引入withRouter
import {withRouter} from 'react-router-dom'

// 引入发请求的函数
import { getHomeData, getGoodsList } from '../api'

const Item = List.Item

export class Home extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      imgHeight: 375, // 轮播图片的高度，解决Carousel组件的bug
      sliderList: [], // 轮播图
      topList: [], // 推荐商品
      goodsList: [] // 商品列表
    }
  }
  // 在这个生命周期函数中发送异步请求
  componentDidMount() {
    getHomeData()
      .then(res => {
        this.setState({
          sliderList: res.data.message.sliderlist,
          topList: res.data.message.toplist
        })
      })
    // 获取商品列表
    getGoodsList()
      .then(res => {
        console.log(res)
        this.setState({
          goodsList: res.data.message
        })
      })
  }
  
  render() {
    return (
      <div>
        {/*
          autoplay: 自动轮播
          infinite 无限循环播放
         */}
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
                src={item.img_url}
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

        {/* 推荐商品 */}
        {/*
          renderHeader渲染列表标题
         */}
        <List renderHeader={() => '推荐商品'}>
          {
            this.state.topList.map(item => (
              <Item
                key={item.id}
                thumb={item.img_url}
                onClick={() => this.props.history.push('/goodsdetail/' + item.id)}
              >{item.title}</Item>
            ))
          }
        </List>

        {/* 商品列表 */}
        {
          this.state.goodsList.map(item => (
            <div className="goods-body" key={item.level1cateid}>
              <h3 className="am-list-header">{item.catetitle}</h3>
              {
                item.datas.map(val => (
                  <div className="goods-item" key={val.artID} onClick={() => this.props.history.push('/goodsdetail/' + val.artID)}>
                    <img src={val.img_url} alt={val.artTitle}/>
                    <h4 className="goods-title">{val.artTitle}</h4>
                    <div className="price-info">
                      <span className="price-new">{val.sell_price}</span>
                      <span className="price-old">{val.market_price}</span>
                    </div>
                      <div className="sell-info">
                        <span className="sell-status">热卖中</span>
                      <span className="leftcount">{val.stock_quantity}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          ))
        }

        <style jsx>{`
          .goods-body {
            overflow: hidden;
            .goods-item {
              float: left;
              width: 50%;
              box-sizing: border-box;
              padding-bottom: 30px;
              position: relative;
              background-color: white;
              &:nth-child(2n+1) {
                  padding-left: 2px;
                  padding-right: 20px;
              }
              &:nth-child(2n) {
                  padding-right: 2px;
                  padding-left: 20px;
              }
              img {
                width: 165.5px;
                height: 165.5px;
              }
              .goods-title {
                box-sizing: border-box;
                height: 31px;
                font-size: 13px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-word;
                color: #232326;
                margin-top: 5px;
                line-height: 16px;
                margin-bottom: 3px;
                padding: 0 4px;
              }
              .price-info {
                position: relative;
                height: 26px;
                font-size: 13px;
                overflow: hidden;
                .price-new {
                  color: #f23030;
                  position: relative;
                  top: 1px;
                  height: 25px;
                  line-height: 25px;
                }
                .price-old {
                  position: absolute;
                  top: 1px;
                  right: 0px;
                  color: #686868;
                  width: 49px;
                  height: 25px;
                  line-height: 25px;
                  text-decoration: line-through;
                }
              }
            }
          }
          `}</style>
      </div>
    )
  }
}

export default withRouter(Home)
