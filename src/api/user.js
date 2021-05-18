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
