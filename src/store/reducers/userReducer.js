let initState = {
  // 保存用户用户状态
  loginState: false
}

export const userReducer = (state = initState, action) => {
  switch (action.type) {
    // 改变用户状态的逻辑
    case 'CHANGE_STATE':
      let newState = action.payload
      return {...state, loginState: newState}
    default:
      return state
  }
}