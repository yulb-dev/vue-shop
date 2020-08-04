import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/Home.vue'
import welcome from './components/Welcome.vue'
import users from './components/users/users.vue'
import rights from './components/power/Rights.vue'
import roles from './components/power/Roles.vue'
import classification from './components/goods/classification.vue'
import parameter from './components/goods/parameter.vue'
import productList from './components/goods/productList.vue'
import add from './components/goods/addGoods.vue'
import order from './components/order/order.vue'
import reports from './components/reports/reports.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home', component: home, redirect: '/home/welcome', children: [
        { path: 'welcome', component: welcome },
        { path: 'users', component: users },
        { path: 'rights', component: rights },
        { path: 'roles', component: roles },
        { path: 'classification', component: classification },
        { path: 'parameter', component: parameter },
        { path: 'productList', component: productList },
        { path: 'productList/add', component: add },
        { path: 'orders', component: order },
        { path: 'reports', component: reports }
      ]
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //        next()  放行  next('/login') 强制跳转

  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
