import request from '@/utils/request'

/**
 * 分页查询服务
 */
export function page (data) {
  return request('/sys/role/page', data)
}

/**
 * 修改
 */
export function update (data) {
  return request('/sys/role/update', data)
}

/**
 * 新增
 */
export function add (data) {
  return request('/sys/role/insert', data)
}

/**
 * 删除
 */
export function del (id) {
  return request('/sys/role/delete', { id })
}

/**
 * 角色列表
 */
export function list () {
  return request('/sys/role/list')
}

/**
 * 获取角色资源
 * @param {*} roleId
 */
export function getRoleResource (roleId) {
  return request('/sys/role/getRoleResource', { roleId })
}

/**
 * 授权角色
 * @param {*} roleId
 * @param {*} resourceIds
 */
export function authRole (roleId, resourceIds) {
  return request('/sys/role/authRole', { roleId, resourceIds })
}
