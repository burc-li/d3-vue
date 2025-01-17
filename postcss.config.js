/**
 * webpack中 postcss-loader plugins配置 优先级 高于 postcss.config.js plugins配置
 * @param {String} env  在 package.json 中使用 cross-env 设置的环境变量 NODE_ENV
 */
module.exports = ({ file, options, env }) => {
  // 如果是生产环境
  if (env === 'production') {
    return {
      plugins: [
        require('postcss-preset-env'),
        require('cssnano'),
      ],
    }
  }
  // 如果是开发环境
  return {
    plugins: [
      require('postcss-preset-env'),
    ],
  }
}
