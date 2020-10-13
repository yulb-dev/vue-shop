import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'


import NProgress from '../node_modules/nprogress/nprogress.js'
// import '../node_modules/nprogress/nprogress.css'
import axios from 'axios'
//配置请求额根路径
axios.defaults.baseURL = 'http://localhost:7060/'
//在request拦截器中,展示进度条
//axios请求预处理
axios.interceptors.request.use(cofig => {
  // console.log(cofig)
  NProgress.start()
  cofig.headers.Authorization = window.sessionStorage.getItem('token')
  return cofig
})
//在response 拦截器中，隐藏进度条 
axios.interceptors.response.use(cofig => {
  NProgress.done()
  return cofig
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
