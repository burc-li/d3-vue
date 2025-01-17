import axios from 'axios'
import createStore from '../store'

const store = createStore()

// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`
const axiosInstance = axios.create()

// `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
// 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
// axiosInstance.defaults.baseURL = process.config.baseUrl

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 10 秒
axiosInstance.defaults.timeout = 100000

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
axiosInstance.interceptors.request.use(
  config => {
    const token = store.state.token
    config.headers.Authorization = token
    return config
  },
  error => Promise.reject(error),
)

/**
 * 响应拦截器
 * 每次请求成成功后， token 过期处理 、token刷新处理 、msg提示统一处理
 */
axiosInstance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data
  },
  error => Promise.reject(error),
)

export default axiosInstance
