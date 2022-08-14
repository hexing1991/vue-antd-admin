import request from '@/utils/request'
import md5 from 'md5'

/**
 * 用户登录
 * @param {*} data
 * @param {String} data.userAccount 账户
 * @param {String} data.userPassword 密码
 * @param {String} data.yzm 验证码
 */
export function login (data) {
  if (data.userPassword) {
    data.userPassword = md5(data.userPassword)
  }
  return request('/sys/loginV2', data)
}

export function getInfo () {
  return request('/sys/getUserInfo')
}

/**
 * 分页查询服务
 */
export function page (data) {
  return request('/sys/user/page', data)
}

/**
 * 修改
 */
export function update (data) {
  return request('/sys/user/update', data)
}

/**
 * 新增
 */
export function add (data) {
  return request('/sys/user/insert', data)
}

/**
 * 删除
 */
export function del (id) {
  return request('/sys/user/delete', { id })
}

/**
 * 修改密码
 * @param {*} data
 * @param {String} data.oldPwd 旧密码
 * @param {String} data.newPwd 新密码
 * @param {String} data.qrPwd 确认密码
 */
export function updatePwd (data) {
  if (data.oldPwd) data.oldPwd = md5(data.oldPwd)
  if (data.newPwd) data.newPwd = md5(data.newPwd)
  if (data.qrPwd) data.qrPwd = md5(data.qrPwd)
  return request('/sys/modifyPassword', data)
}

/**
 * 重置密码
 */
export function resetPwd (id) {
  return request('/sys/user/resetPwd', { id })
}

/**
 * 获取验证码
 */
export function getYzm () {
  return request('/sys/getVerifyV2')
}
