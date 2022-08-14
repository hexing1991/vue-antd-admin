import axios from 'axios'
import store from '@/store'
import storage from '@/utils/storage'
import Modal from 'ant-design-vue/es/modal'
import qs from 'qs'

const ACCESS_TOKEN = 'token'
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  method: 'post',
  timeout: 30000,
  transformRequest: [data => qs.stringify({ ...data })]
})

// request interceptor
service.interceptors.request.use(
  config => {
    const token = storage.get(ACCESS_TOKEN)
    config.headers['accessToken'] = token || undefined
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // res.code 0 成功  -2 token过期  -1 token伪造  其他 失败
    if (res.code !== 0) {
      if (res.code === -2) {
        Modal.confirm({
          title: '温馨提示',
          content: '您的登录状态已过期，请重新登录！',
          onOk: () => store.dispatch('Logout').then(() => location.reload())
        })
        return
      }
      return res
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

const post = async function (url, data) {
  return service({ url, method: 'post', data })
}

export const get = async function (url, params) {
  return service({ url, method: 'get', params })
}

export function checkAuthorization () {
  const token = storage.get(ACCESS_TOKEN)
  return !!token
}

export default post
