// 搜索页面的请求方法
import request from "@/utils/request";

// 搜索联想的api
export const searchSuggest = q => {
  return request({
    method: "GET",
    url: "/app/v1_0/suggestion",
    params: {
      q
    }
  });
};

// 搜索结果的api
export const searchResult = params => {
  return request({
    method: "GET",
    url: "/app/v1_0/search",
    params
  });
};

// 搜索用户搜索历史的api
export const searchHistory = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/search/histories"
  });
};
