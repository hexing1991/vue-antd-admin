import config from '@/config'
import { ADMIN } from '@/config/default'
import { formatFullPath } from '@/utils/i18n'
import { getLocalSetting } from '@/utils/themeUtil'
import routerMap from '@/router/async/router.map'

const localSetting = getLocalSetting(true)
const customTitlesStr = sessionStorage.getItem(process.env.VUE_APP_TBAS_TITLES_KEY)
const customTitles = (customTitlesStr && JSON.parse(customTitlesStr)) || []

/**
 * 动态创建菜单
 * @param {*} resources
 */
function createAsynRoutes (resources) {
  // 首先菜单排序
  resources.sort((a, b) => {
    if (a.resourceType !== b.resourceType) {
      return a.resourceType - b.resourceType
    } else {
      return a.sortNo - b.sortNo
    }
  })
  const tempMap = {}
  const list = []
  for (let i = 0, len = resources.length; i < len; i++) {
    const m = resources[i]
    // 二级权限
    if (m.resourceType > 1) continue
    // 菜单大类
    if (m.resourceType === 0) {
      const route = {
        path: '/' + m.resourceUrl,
        component: () => import('@/layouts/BlankView'),
        name: m.resourceName,
        meta: {
          icon: m.resourceIcon,
          isFolder: true
        },
        sortNo: m.sortNo
      }
      list.push(route)
      tempMap[m.id] = route
    } else if (m.resourceType === 1 && routerMap[m.resourceUrl]) {
      if (tempMap[m.pid]) {
        const item = {
          path: tempMap[m.pid].path + '/' + m.resourceUrl,
          component: routerMap[m.resourceUrl].component,
          name: m.resourceName,
          meta: {
            ...(routerMap[m.resourceUrl].meta || {})
          }
        }

        if (tempMap[m.pid].children) {
          tempMap[m.pid].children.push(item)
        } else {
          tempMap[m.pid].children = [item]
        }
      } else {
        list.push({
          path: '/' + m.resourceUrl,
          component: routerMap[m.resourceUrl].component,
          name: m.resourceName,
          meta: {
            icon: m.resourceIcon,
            ...(routerMap[m.resourceUrl].meta || {})
          },
          sortNo: m.sortNo
        })
      }
    }
  }
  const children = list.filter(m => !(m.meta.isFolder && !m.children))
  children.sort((a, b) => a.sortNo - b.sortNo)
  return [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login/Login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      component: () => import('@/layouts/tabs'),
      redirect: '/dashboard/workplace',
      children: [
        {
          path: '/dashboard/workplace',
          name: '首页',
          meta: {
            icon: 'dashboard',
            page: {
              closable: false
            }
          },
          component: () => import('@/pages/dashboard/workplace'),
        },
        ...children
      ]
    }]
}

export default {
  namespaced: true,
  state: {
    isMobile: false,
    animates: ADMIN.animates,
    palettes: ADMIN.palettes,
    pageMinHeight: 0,
    menuData: [],
    activatedFirst: undefined,
    customTitles,
    ...config,
    ...localSetting
  },
  getters: {
    menuData (state) {
      return state.menuData
    },
    firstMenu (state, getters) {
      const { menuData } = getters
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData)
      }
      return menuData.map(item => {
        const menuItem = { ...item }
        delete menuItem.children
        return menuItem
      })
    },
    subMenu (state) {
      const { menuData, activatedFirst } = state
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData)
      }
      const current = menuData.find(menu => menu.fullPath === activatedFirst)
      return current && current.children || []
    }
  },
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      state.theme = theme
    },
    setLayout (state, layout) {
      state.layout = layout
    },
    setMultiPage (state, multiPage) {
      state.multiPage = multiPage
    },
    setAnimate (state, animate) {
      state.animate = animate
    },
    setWeekMode (state, weekMode) {
      state.weekMode = weekMode
    },
    setFixedHeader (state, fixedHeader) {
      state.fixedHeader = fixedHeader
    },
    setFixedSideBar (state, fixedSideBar) {
      state.fixedSideBar = fixedSideBar
    },
    setLang (state, lang) {
      state.lang = lang
    },
    setHideSetting (state, hideSetting) {
      state.hideSetting = hideSetting
    },
    correctPageMinHeight (state, minHeight) {
      state.pageMinHeight += minHeight
    },
    setMenuData (state, menuData) {
      state.menuData = menuData
    },
    setPageWidth (state, pageWidth) {
      state.pageWidth = pageWidth
    },
    setActivatedFirst (state, activatedFirst) {
      state.activatedFirst = activatedFirst
    },
    setFixedTabs (state, fixedTabs) {
      state.fixedTabs = fixedTabs
    },
    setCustomTitle (state, { path, title }) {
      if (title) {
        const obj = state.customTitles.find(item => item.path === path)
        if (obj) {
          obj.title = title
        } else {
          state.customTitles.push({ path, title })
        }
        sessionStorage.setItem(process.env.VUE_APP_TBAS_TITLES_KEY, JSON.stringify(state.customTitles))
      }
    },
    setMenu (state, menus) {
      state.menuData = createAsynRoutes(menus)
    }
  }
}
