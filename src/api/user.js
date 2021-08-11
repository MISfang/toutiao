// 用户相关的请求方法
import request from "@/utils/request";

// 登录注册
export const login = data => {
  return request({
    method: "POST",
    url: "/app/v1_0/authorizations",
    data
  });
};

// 发送验证码

export const sendSms = mobile => {
  return request({
    method: "GET",
    url: "/app/v1_0/sms/codes/" + mobile
  });
};

// 获取登录用户信息的方法
export const getCurrentUser = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/user"
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  });
};

// 关注用户
export const addFollow = userId => {
  return request({
    method: "POST",
    url: "/app/v1_0/user/followings",
    data: {
      target: userId
    }
  });
};
// 取消关注用户
export const deleteFollow = target => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/user/followings/${target}`
  });
};

// 收藏文章
export const colected = target => {
  return request({
    method: "POST",
    url: "/app/v1_0/article/collections",
    data: {
      target: target
    }
  });
};

// 取消收藏文章
export const deleteColected = target => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/article/collections/${target}`
  });
};

// 点赞文章
export const addLike = target => {
  return request({
    method: "POST",
    url: "/app/v1_0/article/likings",
    data: {
      target: target
    }
  });
};

// 取消点赞文章
export const deleteLike = target => {
  return request({
    method: "DELETE",
    url: `/app/v1_0/article/likings/${target}`
  });
};

// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    method: "GET",
    url: `/app/v1_0/user/profile`
  });
};

// 修改用户个人资料
export const updateUserProfile = data => {
  return request({
    method: "PATCH",
    url: `/app/v1_0/user/profile`,
    data
  });
};

// 修改用户头像
export const updateUserPhoto = data => {
  return request({
    method: "PATCH",
    url: `/app/v1_0/user/photo`,
    data
  });
};
