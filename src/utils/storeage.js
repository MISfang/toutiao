// 本地存储的相关方法

export const getItem = name => {
  const data = window.localStorage.getItem(name);
  try {
    // 把data转化成JSON对象
    return JSON.parse(data);
  } catch (err) {
    // 如果不是字符串格式那就直接导出
    return data;
  }
};
export const setItem = (name, value) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  window.localStorage.setItem(name, value);
};
export const removeItem = name => {
  window.localStorage.removeItem(name);
};
