// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    path: '/login',
    component: () => import('@/pages/login/Login')
  },
  root: {
    path: '/',
    redirect: '/dashboard/workplace',
    component: view.tabs
  },
  dept: {
    component: () => import('@/pages/sys/dept')
  },
  user: {
    component: () => import('@/pages/sys/user')
  },
  role: {
    component: () => import('@/pages/sys/role')
  },
  resource: {
    component: () => import('@/pages/sys/resource')
  },
  dict: {
    component: () => import('@/pages/sys/dict')
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  }
}
export default routerMap

