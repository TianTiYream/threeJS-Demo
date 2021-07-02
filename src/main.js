/*
 * @Description: 入口文件
 * @Author: xxm
 * @Date: 2021-06-07 14:07:07
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(elementUI)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
