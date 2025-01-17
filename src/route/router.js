/**
 * @name VueRouter实例
 */

import VueRouter from 'vue-router'

import createRoutes from './routes'

const routes = createRoutes()
// export 一个函数 而不是直接导出一个vueRouter对象 目的：防止服务端渲染 内存溢出问题
export default () => {
  return new VueRouter({
    routes,
    // 路由不会出现（#/哈希路由) 开发模式下需要配置webpack->devServer->historyApiFallback
    mode: 'history',

    // 基路径 用vue-router跳转的路径都会自动加/h5/ 手动输入无法访问 （前后/都要加）
    // 服务器非根目录部署要加基路径
    // base: '/h5/',
    base: process.config.basePath,

    // 如果浏览器不支持 history 形式的前端路由方式，vue 会自动的给我们 fallback 到 hash 的模式
    fallback: true,

    // 全局设置<router-link></router-link>上的class  部分匹配就会有 class="active-link"
    linkActiveClass: 'active-link',
    // 全局设置<router-link></router-link>上的class 只有精确匹配才会有 class="exact-active-link"
    linkExactActiveClass: 'exact-active-link',
  })
}
