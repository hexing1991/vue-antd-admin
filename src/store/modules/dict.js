import { list, getDictsFun } from '@/api/dict'
import { getDeptTreeById } from '@/api/dept'

function deptListToTree (list) {
  const map = {}
  list.sort((a, b) => a.sortNo - b.sortNo)
  list.forEach(({ id, pid, deptName, sortNo, deptType }) => {
    map[id] = { key: id, pid, value: id, title: deptName, sortNo, deptType }
  })
  const root = []
  for (let i = 0; i < list.length; i++) {
    const { id, pid } = list[i]
    if (map[pid]) {
      if (map[pid].children) {
        map[pid].children.push(map[id])
      } else {
        map[pid].children = [map[id]]
      }
    } else {
      root.push(map[id])
    }
  }
  return root
}

const dict = {
  state: {
    loaded: false,
    paramLoaded: false,
    RESOURCE_TYPE: [
      { itemName: '目录', itemValue: 0 },
      { itemName: '菜单', itemValue: 1 },
      { itemName: '接口', itemValue: 2 },
      { itemName: '按钮', itemValue: 3 }
    ],
    depts: [],
    deptMap: {},
    deptTree: [],
    deptType: [],
    PERSON_TYPE: [],
    BOOLEAN: [],
    BOOLEAN_: [
      { itemName: '否', itemValue: 0 },
      { itemName: '是', itemValue: 1 }
    ],
    TRAVEL_CODE: [],
    CODE_COLOR: [],
    JKM_QUERY: [],
    NAT_QUERY: [],
    VACCINE_QUERY: []
  },
  mutations: {
    SET_DICT: (state, { type, dict }) => {
      state[type] = dict
    },
    SET_SYS: (state, { type, dict }) => {
      state.systemConfig[type] = dict
    },
    SET_FLAG: (state, loaded) => {
      state.loaded = loaded
    },
    SET_PARAM_FLAG: (state, paramLoaded) => {
      state.paramLoaded = paramLoaded
    }
  },
  actions: {
    // 加载字典
    async LoadDict ({ commit, state }) {
      if (state.loaded) return Promise.resolve()
      const [res, res1] = await Promise.all([getDictsFun(), list()])
      commit('SET_FLAG', true)
      res1.data.forEach(({ id, code: type }) => {
        if (['deptType', 'NAT_QUERY'].indexOf(type) > -1) {
          res[id].forEach(m => (m.itemValue = parseInt(m.itemValue, 10)))
        }
        commit('SET_DICT', { type, dict: res[id] })
      })
      return Promise.resolve()
    },
    // 加载部门
    async LoadDepts ({ commit, state }, pid = '0118E879A48640A28A727B210CAEA5AA') {
      if (state.depts.length > 0) return Promise.resolve()
      const res1 = await getDeptTreeById(pid)
      const depts = res1.data.map(({ id: itemValue, deptName: itemName, deptType, sortNo }) => ({ itemValue, itemName, deptType, sortNo }))
      const deptTree = deptListToTree(res1.data)
      const deptMap = res1.data.reduce((pre, cur) => {
        pre[cur.id] = cur
        return pre
      }, {})
      commit('SET_DICT', { type: 'depts', dict: depts })
      commit('SET_DICT', { type: 'deptMap', dict: deptMap })
      commit('SET_DICT', { type: 'deptTree', dict: deptTree })
      return Promise.resolve()
    }
  }

}

export default dict
