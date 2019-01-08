import Vue from 'vue'
import Router from 'vue-router'
import adminLogin from '@/components/login'
import teacherAdmin from '@/components/teacherAdmin'
import studentAdmin from '@/components/studentAdmin'

Vue.use(Router)

export default new Router({
  mode:'history',
  base:'/admin/',
  routes: [
    {
      path: '/',
      redirect: '/login',//设置默认指向的路径
      name: 'adminLogin'
    },
    {
      //登陆
      path: '/login',
      name: 'adminLogin',
      component: adminLogin
    },
    {
      //学生管理
      path: '/studentAdmin',
      name: 'studentAdmin',
      component: studentAdmin
    },
    {
      //教师管理
      path: '/teacherAdmin',
      name: 'teacherAdmin',
      component: teacherAdmin
    },

  ]
})
