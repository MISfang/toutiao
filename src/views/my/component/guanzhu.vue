<template>
  <div class="container">
    <van-sticky :offset-top="135.4">
      <div class="bg">
        <span
          class="title"
        >该用户的{{ type === 1 ? "粉丝" : "关注" }}列表</span>
      </div>
    </van-sticky>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="100"
    >
      <template v-for="(item, index) in userdata">
        <userItem
          :item-data="item"
          :index="index"
          :key="index"
        />
      </template>
    </van-list>
  </div>
</template>
<script>
import { getGuanZhu, getFenSi } from '@/api/my'
import userItem from '@/views/my/component/component/userItem'
export default {
  name: 'GuanZhu',
  components: { userItem },
  data () {
    return {
      userdata: [],
      total_count: 0,

      loading: false,
      finished: false,
      page: 2
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },

  created () {
    this.getData()
  },
  methods: {
    // 初始化数据
    async getData () {
      if (this.type === 1) {
        const { data } = await getFenSi({
          target: this.id,
          page: 1
        })
        this.userdata = data.data.results
      } else {
        const { data } = await getGuanZhu({
          target: this.id,
          page: 1
        })
        this.userdata = data.data.results
      }
    },

    async onLoad () {
      if (this.type === 2) {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        const { data } = await getGuanZhu({
          target: this.id,
          page: this.page
        })
        this.total_count = data.data.total_count
        this.userdata.push(...data.data.results)
        this.$toast({
          message: `更新${data.data.results.length}条\n新的用户`,
          icon: 'like-o'
        })

        this.loading = false
        if (this.userdata.length < this.total_count) {
          this.page++
        } else {
          this.finished = true
        }
      } else {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        const { data } = await getFenSi({
          target: this.id,
          page: this.page
        })
        this.total_count = data.data.total_count
        this.userdata.push(...data.data.results)
        this.$toast({
          message: `更新${data.data.results.length}条\n新的用户`,
          icon: 'like-o',
          duration: 500
        })

        this.loading = false
        if (this.userdata.length < this.total_count) {
          this.page++
        } else {
          this.finished = true
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2);
  margin: 20px auto 0;
}
.van-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
/deep/.van-list__finished-text {
  width: 375px;
}
.title {
  font-size: 24px;
  border-bottom: 2px solid black;
}

.bg {
  text-align: center;
  background-color: #ffffff;
  line-height: 40px;
  height: 40px;
}
/deep/.van-sticky--fixed .bg {
  border-radius: 15px 15px 0 0 !important;
}
</style>
