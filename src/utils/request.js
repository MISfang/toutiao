// 请求后端接口的函数封装
import axios from "axios";
import JSONBig from "json-bigint";
import { Notify } from "vant";

// 在非组件模块中加载store必须用这样的的方法
import store from "@/store/";
import router from "@/router/";

const reFresh = axios.create({
  baseURL: "http://ttapi.research.itcast.cn"
});

const request = axios.create({
  baseURL: "http://ttapi.research.itcast.cn"
  // 这是基础路径
});

// 配置处理后端返回数据中超出js安全整数范围的问题
request.defaults.transformResponse = [
  function(data) {
    try {
      return JSONBig.parse(data);
    } catch (err) {
      return {};
    }
  }
];

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
// 添加响应拦截器
request.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response;
  },
  async function(error) {
    console.dir(error);
    if (error.response) {
      const { status } = error.response;
      if (status === 400) {
        Notify({ type: "warning", message: "请求参数异常" });
      } else if (status === 401) {
        const { user } = store.state;
        if (!user || !user.token) {
          Notify({ type: "warning", message: "没登录，请去登录" });
          router.replace("/login");
          return;
        }
        try {
          const { data } = await reFresh({
            method: "PUT",
            url: "/app/v1_0/authorizations",
            headers: {
              Authorization: `Bearer ${user.refresh_token}`
            }
          });
          user.token = data.data.token;
          store.commit("setUser", user);

          return request(error.config);
        } catch {
          router.replace("/login");
        }
      } else if (status === 403) {
        Notify({ type: "warning", message: "没有权限操作" });
      } else if (status >= 500) {
        Notify({ type: "warning", message: "服务端异常，请稍后重试" });
      }
    }

    const { message } = error;
    if (message === "Network Error") {
      Notify({ type: "warning", message: "网络异常，请稍后重试" });
    }

    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default request;
