import axios from 'axios'

// 绑定基准路径
axios.defaults.baseURL = 'http://localhost:8899';

// 获取轮播图/推荐商品 axios调用接口之后，返回的是一个promise对象
export const getHomeData = () => axios.get('/site/goods/gettopdata/goods')

// 获取首页商品列表
export const getGoodsList = () => axios.get('/site/goods/getgoodsgroup')

// 获取商品详情数据
export const getGoodsDetail = (goodsid) => axios.get('/site/goods/getgoodsinfo/' + goodsid)

// 下单
export const setOrder = (obj) => axios.post('/site/validate/order/setorder', obj)

// 生成支付二维码
export const getCodeurl = obj => axios.post('/site/validate/order/wxpay', obj)

// 查询支付状态
export const queryStatus = obj => axios.post('/site/validate/order/state', obj)

// 登录
export const login = obj => axios.post('/site/account/login', obj)

// 检查用户名是否存在
export const checkUsername = username => axios.get('/site/account/checkuser/' + username)

// 提交注册
export const register = obj => axios.post('/site/account/register', obj)