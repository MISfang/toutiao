// 用户相关的请求方法
import request from "@/utils/request";

// 获取当前用户的频道列表
export const getUserChannels = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/user/channels"
  });
};

// 请求对应频道的文章列表
export const getArticles = params => {
  return request({
    method: "GET",
    url: "/app/v1_1/articles",
    params
  });
};

// 获取所有频道对应的api
export const getAllChannels = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/channels"
  });
};
