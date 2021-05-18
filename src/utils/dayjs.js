// 时间格式化的工具包
import Vue from "vue";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

dayjs.locale("zh-cn");

Vue.filter("relativeTime", value => {
  return dayjs(value).from(dayjs());
});
