let initState = [
  {
    id: 99,
    selectStatus: true,
    img: 'http://127.0.0.1:8899/imgs/dUKuKA_moPdnIC8LjGtyWHmV.jpg',
    title: '飞利浦',
    price: 2222,
    num: 1
  },
  {
    id: 93,
    selectStatus: true,
    img: 'http://127.0.0.1:8899/imgs/dUKuKA_moPdnIC8LjGtyWHmV.jpg',
    title: '飞利浦',
    price: 2222,
    num: 1
  },
]

// 封装一个根据传入的id，在指定数组中找索引的方法
function findIndexInState(arr, id) {
  // 如果没找到就返回-1，如果找到就返回该项的索引
  return arr.findIndex(item => item.id === id)
 }


// reducer函数中传递参数：初始化的state及action
export const cartReducer = (state = initState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // 取出需要添加的商品的id
      let id = action.payload.id
      // 获取当前插入数据在state中的索引值
      let idx = findIndexInState(state, id)
      if (idx !== -1) {
        // 存在，就将该项的num+1
        state[idx].num += 1
        // 必须要return一个新的数据
        return [...state]
      } else {
        // 不存在，直接将该商品的数据合并到state中
        let tempObj = {
          id: action.payload.id,
          selectStatus: true,
          // 前面需要拼接一段ip地址，不然后面cart页面展示不出来图片
          img: 'http://127.0.0.1:8899' + action.payload.img_url,
          title: action.payload.title,
          price: action.payload.sell_price,
          num: 1
        }
        // 合并数据
        return [...state, tempObj]
      }
    case 'UPDATE_ITEM_STATUS':
      // 找到当前数据项的索引
      let idxToUpdate = findIndexInState(state, action.payload)
      // 直接对它的selectStatus取反
      state[idxToUpdate].selectStatus = !state[idxToUpdate].selectStatus
      return [...state]
    case 'UPDATE_ITEM_NUM':
      // 找到当前数据项的索引
      let idxToUpdatenum = findIndexInState(state, action.payload.id)
      // 如果商品数量为1并且执行的是减的操作，就不允许继续执行了
      if (state[idxToUpdatenum].num === 1 && action.payload.unit === -1) {
        return [...state]
      }
      state[idxToUpdatenum].num += action.payload.unit
      return [...state]
    case 'DELETE_ITEM':
      // 找到当前数据项的索引
      let idxToDel = findIndexInState(state, action.payload)
      state.splice(idxToDel, 1)
      return [...state]
    // 更新所有商品的状态
    case 'UPDATE_ALL_STATUS':
      // 获取当前全选状态
      let currentAllStatus = action.payload
      // 对当前state中的所有数据的selectStatus赋值，值为当前全选状态的反面
      state.map(item => {
        item.selectStatus = !currentAllStatus
      })
      return [...state]
    default:
      return state
  }
}