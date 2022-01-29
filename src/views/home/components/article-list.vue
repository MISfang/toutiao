<template>
  <div ref="article-list">
    <!-- 列表组件 -->
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isPullDownLoading"
      @refresh="onRefresh"
      success-text="数据更新成功"
    >
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
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/news'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 文章列表数据
      articles: [],
      loading: false,
      finished: false,
      //   页面,获取下一页数据的时间戳
      timestamp: null,
      //   页面是否下拉刷新的flag
      isPullDownLoading: false,
      scrollTop: 0
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop
    })
  },

  activated () {
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  methods: {
    //   触底加载更多
    async onLoad () {
      // 异步更新数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now()
      })
      const { results } = data.data
      this.articles.push(...results)
      // 3.设置本次加载状态结束，他可以判断是否要加载下一次，否则就会永远的停在这里
      this.loading = false

      if (results.length) {
        //   说明下一页他还有数据，更新数据
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
        // 数据全部加载完成
      }
    },

    // 下拉刷新方法
    async onRefresh () {
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      const { results } = data.data
      this.articles.unshift(...results)
      this.$toast({
        message: `更新${results.length}篇文章`,
        icon: 'like-o'
      })
      //   数据追加完成，关闭加载状态
      this.isPullDownLoading = false
    }
  }
}
</script>

<style lang="less">
.article-list {
  margin-bottom: 60px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
