/**
 * @name 入口文件
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import globalComp from '@/components'
import createRouter from '@/route/router'
import createStore from '@/store'
import App from '@/app.vue'
import '@/assets/styles/global.less'

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import defineFigureGenerator from '@/utils/figures.js'
defineFigureGenerator()

Vue.use(ViewUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(globalComp)

const router = createRouter()
const store = createStore()

// 挂载到全局window对象上
window.vm = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})

// 通知 webpack 该模块接受 hmr
if (module.hot) {
  module.hot.accept()
}
