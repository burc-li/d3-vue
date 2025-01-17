/**
 * @name 区分开发环境和生产环境的webpack配置
 */
const path = require('path')
// 合并webpack配置文件
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
// 配置CSS单独分离打包  开发环境使用 vue-style-loader   生产环境使用 MiniCssExtractPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// JavaScript 压缩工具，单线程压缩代码
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// JavaScript 压缩工具，多个子进程并行压缩代码
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
// 打包进度条显示
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
// 多进程Loader文件转换处理
const HappyPack = require('happypack')
// 构造出共享进程池，进程池中包含4个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 4 })

const config = merge(baseConfig, {
  // nosources：使用这个关键字的Source Map不包含sourcesContent，调试时只能看到文件信息和行信息，无法看到源码。
  devtool: 'nosources-source-map',

  // 准确地控制终端展示的信息 控制台不输出 构建模块信息 和 children 信息
  stats: {
    modules: false,
    children: false,
  },

  module: {
    rules: [
      // 解析和转换 css代码 或 .css 文件
      // css-loader: 对 @import 和 url() 进行处理，但此时页面样式并不生效
      // style-loader: 将 css-loader 打包好的 CSS 代码以<style>标签的形式插入到 HTML 文件中。页面样式生效
      // 它会应用到普通的 `.css` 文件 以及  `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 为CSS中的图像、文件等外部资源指定自定义公共路径，将CSS文件抽离出来后，css文件和资源文件可能不在同一级目录，需要添加'./' '../' '../../'，此时会在url()等引用外部资源的地方自动添加相对路径'./' '../' '../../'
              // 和MiniCssExtractPlugin-》filename有关，
              // 若filename 为 '[name].[contenthash:8].css',则 publicPath 为 './'
              // 若filename 为 'css/[name].[contenthash:8].css',则 publicPath 为 '../'
              publicPath: '../',
            },
          },
          // 把对 .css 文件的处理转交给 id 为 css 的 HappyPack 实例，注意 MiniCssExtractPlugin不能添加到 happypack 实例中
          'happypack/loader?id=css',
        ],
      },
      // 解析和转换.less 文件
      // Loader 解析顺序从右向左 style-loader(css-loader(less-loader(content)))
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 为CSS中的图像、文件等外部资源指定自定义公共路径，将CSS文件抽离出来后，css文件和资源文件可能不在同一级目录，需要添加'./' '../' '../../'，此时会在url()等引用外部资源的地方自动添加相对路径'./' '../' '../../'
              // 和MiniCssExtractPlugin-》filename有关，
              // 若filename 为 '[name].[contenthash:8].css',则 publicPath 为 './'
              // 若filename 为 'css/[name].[contenthash:8].css',则 publicPath 为 '../'
              publicPath: '../',
            },
          },
          // 把对 .less 文件的处理转交给 id 为 less 的 HappyPack 实例 ，注意 MiniCssExtractPlugin不能添加到 happypack 实例中
          'happypack/loader?id=less',
        ],
      },
    ],
  },

  plugins: [
    //  配置CSS单独分离打包，将CSS从JS中抽离出来，为每个包含CSS的JS文件创建一个CSS文件
    // 输出 [contenthash:8] 哈希算法随机生成 8位 大/小写字母和数字 例如： main.5917e715.css
    // 只要css文件内容不变，那么不会重复构建，粒度是每个文件的内容
    new MiniCssExtractPlugin({
      // 输出路径是output->path指定的路径
      // 输出 css 的名称，一般是入口文件对应的css文件
      filename: 'css/[name].[contenthash:8].css',
      // 输出非入口(non-entry) chunk 文件的名称，默认'[id].js'
      chunkFilename: 'css/[id].[contenthash:8].css',
      // 删除有关css冲突顺序的警告，例如在a.js 里，引入的顺序是1.css、2.css; 在b.js里，引入顺序是1.css、2.css,
      ignoreOrder: true,
    }),

    // 打包进度条显示
    new SimpleProgressWebpackPlugin(),

    // 使用 HappyPack 加速构建，多进程Loader文件转换处理
    new HappyPack({
      id: 'css',
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
      // 如何处理 .css 文件，用法和 Loader 配置中一样
      loaders: [
        'css-loader',
        'postcss-loader',
      ],
    }),

    // 使用 HappyPack 加速构建，多进程Loader文件转换处理
    new HappyPack({
      id: 'less',
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
      // 如何处理 .less 文件，用法和 Loader 配置中一样
      loaders: [
        {
          loader: 'css-loader',
          // 配置 css-loader 作用于 @import 引入的css文件之前，要使用几个其它的loader进行处理
          // 此处有两个loader  postcss-loader、less-loader
          options: {
            importLoaders: 2,
          },
        },
        'postcss-loader',
        'less-loader',
      ],
    }),

    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      cache: false, // 开启缓存
      parallel: true, // 开启多个进程并行处理
      uglifyJS: {
        // 是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用不大的警告
        warnings: true,
        output: {
          // 最紧凑的输出,是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果
          beautify: false,
          // 是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
          comments: false,
        },
        compress: {
          // 是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
          drop_console: true,
          // 是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 1, 默认为不转换，为了达到更好的压缩效果，可以设置为false
          collapse_vars: true,
          // 是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成var a = 'xxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false
          reduce_vars: true,
        },
      },
    }),
  ],

  optimization: {
    // 开启 作用域提升 Scope Hoisting,打包出来的代码文件更小、运行的更快
    concatenateModules: true,
    // 代码拆分
    splitChunks: {
      minSize: 30000, // 29.2KB 单位是字节Byte 如果一个模块符合之前所说的拆分规则，但是如果提取出来最后生成文件大小比minSize要小，那它仍然不会被提取出来。这个属性可以在每个缓存组属性中设置，也可以在splitChunks属性中设置，这样在每个缓存组都会继承这个配置
      maxAsyncRequests: 30, // 当整个项目打包完之后，一个按需加载的包最终被拆分成 n 个包，maxAsyncRequests 就是用来限制 n 的最大值
      maxInitialRequests: 30, // 允许入口并行加载的最大请求数
      cacheGroups: {
        // 新分离出来的chunk块，需要在html-webpack-plugin 或者 web-webpack-plugin 指定所需要的chunk块，否则页面空白！！！
        module: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/, // 匹配模块的路径 test属性用于进一步控制缓存组选择的模块 使用[\\/]来表示路径分隔符，为了兼容Unix系统和Windows
          chunks: 'all', // 定哪些类型的chunk参与拆分  all 代表所有模块，async代表只管异步加载的, initial代表初始化时就能获取的模块
          minChunks: 1, // 模块被引用1次及以上的才抽离
          priority: -10, // 规则优先级，当缓存组中设置有多个拆分规则，而某个模块同时符合好几个规则的时候，则需要通过优先级属性priority来决定使用哪个拆分规则。优先级高者执行
          reuseExistingChunk: true, // 复用其他chunk内已拥有的模块,而不是创建一个包含公共模块B和C的新块
        },
        default: {
          name: 'common',
          chunks: 'all', // 定哪些类型的chunk参与拆分  all 代表所有模块，async代表只管异步加载的, initial代表初始化时就能获取的模块
          minChunks: 2,
          minSize: 20000,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
})

module.exports = config
