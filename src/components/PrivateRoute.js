
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
// 在PrivateRoute中解构出component/loginState和path属性，其中path属性放在rest变量中
// Component表示Mine组件
function PrivateRoute({ component: Component, loginState, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        loginState ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
export default PrivateRoute