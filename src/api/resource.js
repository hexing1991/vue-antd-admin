import request from '@/utils/request'

/**
 * 分页查询服务
 */
export function list (data) {
  return request('/sys/resource/list', data)
}

/**
 * 修改
 */
export function update (data) {
  return request('/sys/resource/update', data)
}

/**
 * 新增
 */
export function add (data) {
  return request('/sys/resource/insert', data)
}

/**
 * 删除
 */
export function del (id) {
  return request('/sys/resource/delete', { id })
}

/**
 * 查询下级菜单
 */
export function getResourceByPid (pid) {
  return request('/sys/resource/list', { pid })
}

export function refreshResources () {
  return request('/sys/refreshResources')
}
