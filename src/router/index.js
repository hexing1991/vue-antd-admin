import Vue from 'vue'
import Router from 'vue-router'
import { formatRoutes } from '@/utils/routerUtil'

Vue.use(Router)

// 不需要登录拦截的路由配置
const loginIgnore = {
  paths: ['/login', '/404', '/403'],   //根据路由fullPath匹配
  /**
   * 判断路由是否包含在该配置中
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes (route) {
    return this.paths.includes(route.path)
  }
}

/**
 * 初始化路由实例
 * @returns {VueRouter}
 */
function initRouter () {
  const options = require('./async/config.async').default
  formatRoutes(options.routes)
  return new Router(options)
}
export { loginIgnore, initRouter }
