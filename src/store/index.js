import Vuex from 'vuex'

import defaultState from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

export default () => {
  const store = new Vuex.Store({
    state: defaultState,
    mutations,
    getters,
    actions,
  })

  // 给 vuex 加一个 热更新
  // 热更新功能 不用每次刷新页面
  if (module.hot) {
    module.hot.accept([
      './state',
      './mutations',
      './actions',
      './getters',
    ], () => {
      const newState = require('./state').default
      const newMutations = require('./mutations').default
      const newActions = require('./actions').default
      const newGetters = require('./getters').default

      store.hotUpdate({
        state: newState,
        mutations: newMutations,
        getters: newGetters,
        actions: newActions,
      })
    })
  }

  return store
}
