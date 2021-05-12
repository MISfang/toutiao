// 用户相关的请求方法
import request from "@/utils/request";

// 登录注册
export const login = data => {
  return request({
    method: "POST",
    url: "/app/v1_0/authorizations",
    // url;"http://ttapi.research.itcast.cn/app/v1_0/authorizations"
    data
  });
};
