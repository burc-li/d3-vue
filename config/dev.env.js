const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: JSON.stringify('dev'),
  basePath: JSON.stringify('/'), // 开发环境为 /   生产环境非根目录部署 /h5/  根目录部署 /
  baseUrl: JSON.stringify('https://www.baidu.com/'),
})
