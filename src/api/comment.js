// 用户相关的请求方法
import request from '@/utils/request'

// 获取评论或者评论回复
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}

// 评论点赞
export const likeComments = target => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: target
    }
  })
}

// 删除评论
export const deletelikeComments = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

// 发表评论
export const addComments = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
