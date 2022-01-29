import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入vantUI组件
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

// 设置rem基准值的插件
import 'amfe-flexible'

// 加载全局样式,放在最后，使他的覆盖层级最高
import './styles/index.less'

import './utils/dayjs'

// 全局注册vant组件
Vue.use(Vant)
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
