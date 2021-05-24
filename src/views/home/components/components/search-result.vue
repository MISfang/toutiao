<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      class="list"
      loading-text="疯狂加载中..."
    >
      <van-cell v-for="(item, id) in list" :key="id">
        <div slot="title" v-html="highlight(item.title)"></div>
        <template #right-icon>
          <div class="xuhao">{{ id + 1 }}</div>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { searchResult } from "@/api/search.js";
import { Toast } from "vant";
export default {
  name: "searchResult",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, //页码
      per_page: 10 //每页数据量的大小
    };
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad() {
      const { data } = await searchResult({
        page: this.page, //这个是页码
        per_page: this.per_page, //每页的数据量
        q: this.searchText
      });
      const { results } = data.data;
      this.list.push(...results);
      if (results.length === 0) {
        Toast({
          message: "搜索无结果",
          icon: "warning-o",
          duration: 2000
        });
      }
      // 然后关闭本次loading
      this.loading = false;

      // 如果还有数据，就更新下一次数据
      if (results.length) {
        this.page++;
        Toast({
          message: "加载搜索\n结果成功",
          icon: "like-o",
          duration: 500
        });
      } else {
        this.finished = true;
        Toast({
          message: "没有更多\n数据啦!",
          icon: "warning-o",
          duration: 500
        });
      }
    },

    // 处理关键字高亮的函数
    highlight(str) {
      const ZZ = new RegExp(this.searchText, "gi");
      const res = str.replace(
        ZZ,
        `<span style="color:#2892ff;font-weight:700;font-size:15px">${this.searchText}</span>`
      );
      return res;
    }
  }
};
</script>

<style lang="less" scoped>
.search-result {
  .list {
    margin: 10px 10px 40px 10px;
    .van-cell {
      background-color: #f7f8fa;
      border: 1px solid #9ebfe0;
      border-radius: 12px;
      margin: 2px 0;
      box-shadow: 4px 10px 12px 2px #ebedf0;
      /deep/.xuhao {
        margin-right: -10px;
        font-size: 14px;
        color: white;
        font-weight: 700;
        border: 1px solid#2892ff;
        text-align: center;
        height: 24px;
        width: 24px;
        background-color: rgba(40, 146, 255, 0.5);
        border-radius: 20px;
      }
    }
  }
}
</style>
