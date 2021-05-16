// 请求后端接口的函数封装
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn' // 这是基础路径
})

// 请求拦截器

// 响应拦截器

export default request
