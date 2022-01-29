<template>
  <div class="container">
    <van-sticky :offset-top="135.4">
      <div class="bg">
        <span class="mytitle">{{ text }}</span>
      </div>
    </van-sticky>
    <!-- 下拉刷新 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="全部加载完成了"
      @load="onLoad"
      class="article-list"
    >
      <!-- 遍历封装好的文章列表组件 -->
      <article-item
        v-for="(article, index) in articles"
        :key="index"
        :article="article"
      />
    </van-list>
  </div>
</template>

<script>
import ArticleItem from '@/components/article-item'
import { getAllArt, getAllCol, getAllHis } from '@/api/my'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    type: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 文章列表数据
      articles: [],
      loading: false,
      finished: false,
      page: 2,
      total_count: 0,
      text: ''
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getData()
  },
  methods: {
    // 先判斷一下是什么类型
    getWhichType () {
      if (this.type === 1) {
        this.text = '该用户发布的文章列表'
        return getAllArt
      } else if (this.type === 2) {
        this.text = '该用户收藏的文章列表'
        return getAllCol
      } else {
        this.text = '该用户的文章浏览历史'
        return getAllHis
      }
    },
    // 初始化数据
    async getData () {
      const isTypeFunc = this.getWhichType()
      const { data } = await isTypeFunc({
        page: 1
      })
      this.articles = data.data.results
      this.total_count = data.data.total_count
    },

    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      const isTypeFunc = this.getWhichType()
      const { data } = await isTypeFunc({
        page: this.page
      })
      this.articles.push(...data.data.results)
      this.$toast({
        message: `加载${data.data.results.length}条\n该用户文章`,
        icon: 'like-o',
        duration: 500
      })
      // 加载状态结束
      this.loading = false

      if (this.articles.length < this.total_count) {
        this.page += 1
      } else {
        // 设置全部加载完成
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  margin: 40px auto 0;
  .article-list {
    margin-bottom: 60px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .mytitle {
    font-size: 24px;
    border-bottom: 2px solid black;
  }
  .bg {
    text-align: center;
    background-color: #ffffff;
    line-height: 40px;
    height: 40px;
  }
}
/deep/.van-sticky--fixed .bg {
  border-radius: 15px 15px 0 0 !important;
}
</style>
