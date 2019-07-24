const { override, addBabelPlugins, fixBabelImports } = require('customize-cra');
module.exports = override(
  // 添加babel的styled-jsx插件 以及 处理sass语法的插件
  ...addBabelPlugins(
    [
      "styled-jsx/babel",
      { "plugins": ["styled-jsx-plugin-sass"] }
    ]
  ),
  // antd-mobile组件按需加载配置
  fixBabelImports('import', {
    libraryName: 'antd-mobile', style: 'css'
  })
)