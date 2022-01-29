// 用户相关的请求方法
import request from '@/utils/request'

// 获取当前用户的频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}

// 请求对应频道的文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}

// 获取所有频道对应的api
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 修改用户频道列表
export const addUserChannels = params => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      params
    }
  })
}

// 删除指定用户频道列表
export const deleteUserChannels = channelId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}

// 获取新闻详情数据
export const detailArticle = articleID => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleID}`
  })
}
