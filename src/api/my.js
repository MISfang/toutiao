// 用户相关的请求方法
import request from '@/utils/request'

// 获取当前用户的关注列表
export const getGuanZhu = params => {
  return request({
    method: 'GET',
    url: '/v1_0/user/followings',
    params
  })
}

// 获取当前用户的粉丝列表
export const getFenSi = params => {
  return request({
    method: 'GET',
    url: '/v1_0/user/followers',
    params
  })
}

// 获取当前用户的文章列表
export const getAllArt = params => {
  return request({
    method: 'GET',
    url: '/v1_0/user/articles',
    params
  })
}

// 获取当前用户的收藏列表
export const getAllCol = params => {
  return request({
    method: 'GET',
    url: '/v1_0/article/collections',
    params
  })
}

// 获取当前用户的历史记录列表
export const getAllHis = params => {
  return request({
    method: 'GET',
    url: '/v1_0/user/histories',
    params
  })
}
