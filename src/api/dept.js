import request from '@/utils/request'

/**
 * 分页查询服务
 */
export function page (data) {
  return request('/sys/dept/page', data)
}

/**
 * 修改
 */
export function update (data) {
  return request('/sys/dept/update', data)
}

/**
 * 新增
 */
export function add (data) {
  return request('/sys/dept/insert', data)
}

/**
 * 删除
 */
export function del (id) {
  return request('/sys/dept/delete', { id })
}

/**
 * 查询机构树
 */
export function getDeptListByPid (pid) {
  return request('/sys/dept/list', { pid })
}

/**
 * 获取部门Tree
 * @param {*} id
 * @returns
 */
export function getDeptTreeById (id) {
  return request('/sys/dept/getChildList', { id })
}
