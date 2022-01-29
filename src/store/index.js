import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storeage'

Vue.use(Vuex)

// 可以避免定义的用户名不一致，或者出错的问题
// 一旦出错马上报错
const USER_KEY = 'login_user'
export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY), // 当前用户的登录状态

    cachePages: ['Layout']
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 为了实现数据持久化，还是需要本地存储
      setItem(USER_KEY, state.user)
    },
    addCachePage (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    removeCachePage (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {},
  modules: {}
})
