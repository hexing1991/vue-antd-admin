import routerMap from '@/router/async/router.map'
import { mergeI18nFromRoutes } from '@/utils/i18n'
import Router from 'vue-router'
import basicOptions from '@/router/async/config.async'

//应用配置
let appOptions = {
  router: undefined,
  i18n: undefined,
  store: undefined
}

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions (options) {
  const { router, store, i18n } = options
  appOptions.router = router
  appOptions.store = store
  appOptions.i18n = i18n
}

/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param routesConfig 路由配置
 * @param routerMap 本地路由组件注册配置
 */
function parseRoutes (routesConfig, routerMap) {
  let routes = []
  routesConfig.forEach(item => {
    // 获取注册在 routerMap 中的 router，初始化 routeCfg
    let router = undefined, routeCfg = {}
    if (typeof item === 'string') {
      router = routerMap[item]
      routeCfg = {
        path: (router && router.path) || item,
        router: item
      }
    } else if (typeof item === 'object') {
      router = routerMap[item.router]
      routeCfg = item
    }
    if (!router) {
      console.warn(`can't find register for router ${JSON.stringify(item)}, please register it in advance.`)
      router = typeof item === 'string' ? { path: item, name: item } : item
    }
    // 从 router 和 routeCfg 解析路由
    const meta = {
      authority: router.authority,
      icon: router.icon,
      page: router.page,
      link: router.link,
      params: router.params,
      query: router.query,
      ...router.meta
    }
    const cfgMeta = {
      authority: routeCfg.authority,
      icon: routeCfg.icon,
      page: routeCfg.page,
      link: routeCfg.link,
      params: routeCfg.params,
      query: routeCfg.query,
      ...routeCfg.meta
    }
    Object.keys(cfgMeta).forEach(key => {
      if (cfgMeta[key] === undefined || cfgMeta[key] === null || cfgMeta[key] === '') {
        delete cfgMeta[key]
      }
    })
    Object.assign(meta, cfgMeta)
    const route = {
      path: routeCfg.path || router.path || routeCfg.router,
      name: routeCfg.name || router.name,
      component: router.component,
      redirect: routeCfg.redirect || router.redirect,
      meta: {
        ...meta,
        authority: meta.authority || '*'
      }
    }
    if (routeCfg.invisible || router.invisible) {
      route.meta.invisible = true
    }
    if (routeCfg.children && routeCfg.children.length > 0) {
      route.children = parseRoutes(routeCfg.children, routerMap)
    }
    routes.push(route)
  })
  return routes
}

/**
 * 加载路由
 * @param routesConfig {RouteConfig[]} 路由配置
 */
function loadRoutes (routesConfig) {
  // 应用配置
  const { router, store, i18n } = appOptions

  if (routesConfig && routesConfig.length > 0) {
    const routes = parseRoutes(routesConfig, routerMap)
    const finalRoutes = mergeRoutes(basicOptions.routes, routes)
    formatRoutes(finalRoutes)
    router.options = { ...router.options, routes: finalRoutes }
    router.matcher = new Router({ ...router.options, routes: [] }).matcher
    finalRoutes.forEach(route => router.addRoute(route))
  }
  // 提取路由国际化数据
  mergeI18nFromRoutes(i18n, router.options.routes)
  // 初始化Admin后台菜单数据
  const rootRoute = router.options.routes.find(item => item.path === '/')
  const menuRoutes = rootRoute && rootRoute.children
  if (menuRoutes) {
    store.commit('setting/setMenuData', menuRoutes)
  }
}

/**
 * 合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes (target, source) {
  const routesMap = {}
  target.forEach(item => routesMap[item.path] = item)
  source.forEach(item => routesMap[item.path] = item)
  return Object.values(routesMap)
}

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes (routes) {
  routes.forEach(route => {
    const { path } = route
    if (!path.startsWith('/') && path !== '*') {
      route.path = '/' + path
    }
  })
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey (path) {
  const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
  keys.push('name')
  return keys.join('.')
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards (guards, options) {
  const { beforeEach, afterEach } = guards
  const { router } = options
  beforeEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.beforeEach((to, from, next) => guard(to, from, next, options))
    }
  })
  afterEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.afterEach((to, from) => guard(to, from, options))
    }
  })
}

export { parseRoutes, loadRoutes, getI18nKey, loadGuards, formatRoutes, setAppOptions }
