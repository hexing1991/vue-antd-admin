import Vue from 'vue'
import store from '@/store'

// 是否有权限
const hasPermission = (permissions, type = 'or') => {
  // 当前菜单需要的权限
  const requirePermissionList = Array.isArray(permissions) ? permissions : [permissions]
  // 用户持有的权限
  const userPermissionList = store.state.user.authorities
  // 判断用户是否持有菜单需要权限
  return type === 'and' ? !requirePermissionList.some(e => !userPermissionList.includes(e)) : userPermissionList.some(e => requirePermissionList.includes(e))
}

// 指令
Vue.directive('authority', {
  inserted: (el, binding) => {
    if (!hasPermission(binding.value, binding.arg)) {
      el.parentNode.removeChild(el)
    }
  }
})
