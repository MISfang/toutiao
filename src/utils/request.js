// 请求后端接口的函数封装
import axios from "axios";

// 在非组件模块中加载store必须用这样的的方法
import store from "@/store/";

const request = axios.create({
  baseURL: "http://ttapi.research.itcast.cn" // 这是基础路径
});

// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么

    const { user } = store.state;
    if (user) {
      // 判断一下如果用户已经登录，那在这里统一给用户设置token
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    // 处理完之后一定要发config返回，这个相当于放行的标志
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器

export default request;
