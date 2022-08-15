import storage from '@/utils/storage'
import { login, getInfo } from '@/api/user'
import { Base64 } from 'js-base64'
const ACCESS_TOKEN = 'token'
const user = {
  namespaced: true,
  state: {
    token: storage.get(ACCESS_TOKEN),
    userId: '',
    userName: '',
    userDeptId: '',
    userDeptName: '',
    userDeptCode: null,
    deptType: null,
    roles: [],
    resources: [],
    authorities:[]
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INFO: (state, m) => {
      state.userId = m.user.id
      state.userName = m.user.userName
      state.userDeptId = m.dept.id
      state.userDeptName = m.dept.deptName
      state.deptType = m.dept.deptType
      state.userDeptCode = m.dept.deptCode
      state.roles = m.roles
      state.resources = m.resources
      state.authorities = m.resources.filter(m => m.resourceType === 3).map(m => m.resourceUrl)
    }
  },

  actions: {
    // 登录
    async Login ({ commit }, userInfo) {
      const response = await login(userInfo)
      if (response.code !== 0) return Promise.reject(new Error(response.msg))
      const { data } = response
      commit('SET_TOKEN', data)
      const str = Base64.decode(data.split('.')[1]).toString()
      const { exp } = JSON.parse(str)
      storage.set(ACCESS_TOKEN, data, exp * 1000 - 200000)
      return Promise.resolve()
    },

    // 获取用户信息
    async GetInfo ({ commit, state }) {
      const response = await getInfo(state.token)
      const { data } = response
      if (!data) return Promise.reject(new Error('获取信息失败，请重新登录！'))
      const { roles } = data
      if (!roles || roles.length <= 0) return Promise.reject(new Error('用户角色不能为空'))
      commit('SET_INFO', data)
      return Promise.resolve(data)
    },

    // 登出
    async Logout ({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_INFO', {
        user: {},
        dept: {},
        roles: [],
        resources: []
      })
      storage.remove(ACCESS_TOKEN)
      return Promise.resolve()
    }
  }

}

export default user
