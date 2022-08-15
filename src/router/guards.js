import NProgress from 'nprogress'
import { loginIgnore } from '@/router/index'
import { checkAuthorization } from '@/utils/request'
import { loadRoutes } from '@/utils/routerUtil'
import store from '@/store'

NProgress.configure({ showSpinner: false })

/**
 * 进度条开始
 * @param to
 * @param form
 * @param next
 */
const progressStart = (to, from, next) => {
  if (!NProgress.isStarted()) {
    NProgress.start()
  }
  next()
}

/**
 * 登录守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const loginGuard = (to, from, next, options) => {
  if (!loginIgnore.includes(to) && !checkAuthorization()) {
    options.message.warning('登录已失效，请重新登录')
    next({ path: '/login' })
  } else {
    next()
  }
}

const refreshGuard = async (to, from, next) => {
  if(loginIgnore.includes(to)) next()
  if (store.state.user.roles.length === 0) {
    try {
      const res = await store.dispatch('user/GetInfo')
      console.log(res)
      if (!res.roles || res.roles.length === 0) {
        return next({ path: '/login' })
      }
      store.commit('setting/setMenu', res.resources)
      loadRoutes(store.state.setting.menuData)
    } catch (e) {
      console.log(e)
      return next({ path: '/login' })
    }
  }
  next()
}

/**
 * 混合导航模式下一级菜单跳转重定向
 * @param to
 * @param from
 * @param next
 * @param options
 * @returns {*}
 */
const redirectGuard = (to, from, next, options) => {
  const { store } = options
  const getFirstChild = (routes) => {
    const route = routes[0]
    if (!route.children || route.children.length === 0) {
      return route
    }
    return getFirstChild(route.children)
  }
  if (store.state.setting.layout === 'mix') {
    const firstMenu = store.getters['setting/firstMenu']
    if (firstMenu.find(item => item.fullPath === to.fullPath)) {
      store.commit('setting/setActivatedFirst', to.fullPath)
      const subMenu = store.getters['setting/subMenu']
      if (subMenu.length > 0) {
        const redirect = getFirstChild(subMenu)
        return next({ path: redirect.fullPath })
      }
    }
  }
  next()
}

/**
 * 进度条结束
 * @param to
 * @param form
 * @param options
 */
const progressDone = () => {
  NProgress.done()
}

export default {
  beforeEach: [progressStart, loginGuard, refreshGuard, redirectGuard],
  afterEach: [progressDone]
}
