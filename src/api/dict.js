import request from '@/utils/request'

/**
 * 查询
 */
export function list (data) {
  return request('/sys/dict/list', data)
}

/**
 * 修改
 */
export function update (data) {
  return request('/sys/dict/update', data)
}

/**
 * 新增
 */
export function add (data) {
  return request('/sys/dict/insert', data)
}

/**
 * 删除
 */
export function del (id) {
  return request('/sys/dict/delete', { id })
}

/**
 * 分页查询服务
 */
export function listItem (data) {
  return request('/sys/dict/item/list', data)
}

/**
 * 修改
 */
export function updateItem (data) {
  return request('/sys/dict/item/update', data)
}

/**
 * 新增
 */
export function addItem (data) {
  return request('/sys/dict/item/insert', data)
}

/**
 * 删除
 */
export function delItem (id) {
  return request('/sys/dict/item/delete', { id })
}

/**
 * 加载dicts，并缓存
 * @returns
 */
function getDicts () {
  const dicts = {}
  return async function () {
    if (dicts.flag) return Promise.resolve(dicts)
    const res = await request('/sys/dict/item/queryDictItemByDictCodes')
    if (res.code !== 0) return Promise.reject(new Error(res.msg))
    res.data.sort((a, b) => (a.sortNo - b.sortNo))
    for (let i = 0; i < res.data.length; i++) {
      const { dictId, itemName, itemValue, sortNo, columnOne, columnTwo, columnThree } = res.data[i]
      if (dicts[dictId]) {
        dicts[dictId].push({ itemName, itemValue, sortNo, columnOne, columnTwo, columnThree })
      } else {
        dicts[dictId] = [{ itemName, itemValue, sortNo, columnOne, columnTwo, columnThree }]
      }
    }
    dicts.flag = true
    return Promise.resolve(dicts)
  }
}

/**
 * 查询字典
 */
export const getDictsFun = getDicts()

function getAreas () {
  const areas = []
  return async function () {
    if (areas.length > 0) return Promise.resolve(areas)
    const res = await request('/area/queryList')
    if (res.code === 0) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(new Error('加载区域错误'))
    }
  }
}

export const getAllAreas = getAreas()
