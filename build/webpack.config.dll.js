/**
 * @name 打包动态链接库的webpack配置
 * @description 用于开发环境，可大大加快构建速度，不建议用于生产环境，其并不会缩小打包体积
 */
const path = require('path')
const webpack = require('webpack')
const pathConfig = require('./pathConfig')

module.exports = {
  mode: 'development',

  // JS 执行入口文件
  entry: {
    // 把相关模块的放到一个单独的动态链接库
    vendors: [pathConfig.appVendorConfigs],
  },

  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，也就是 entry 中配置的 vendors
    filename: '[name].dll.js',
    // 输出的文件都放到 dll 目录下
    path: pathConfig.appDll,
    // 存放动态链接库的全局变量名称，例如对应 vendors 来说就是 _dll_vendors
    // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
    library: '_dll_[name]',
  },

  plugins: [
    // 接入 DllPlugin
    new webpack.DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      name: '_dll_[name]',
      // 同 webpack.config.dev.js 中 DllReferencePlugin 的 context上下文一致
      context: pathConfig.appDll,
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.resolve(pathConfig.appDll, '[name].manifest.json'),
    }),
  ],
}
