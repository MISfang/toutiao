<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="finishText"
      @load="onpinlun"
      class="cellGroup"
    >
      <template v-if="type === 'a'">
        <h4 class="bigTitle">
          全部评论
        </h4>
        <div class="xian" />
      </template>
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        @reply="$emit('reply', $event)"
        :type="type"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import commentItem from './comment-item'
import '@/utils/dayjs'

export default {
  name: 'CommentList',
  components: {
    commentItem
  },
  data () {
    return {
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      finishText: this.type === 'a' ? '没有评论了' : '没有回复了'
    }
  },
  props: {
    source: {
      type: [String, Number, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    // 评论的类型
    type: {
      type: String,
      default: 'a'
    }
  },
  methods: {
    async onpinlun () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      const { data } = await getComments({
        type: this.type,
        source: this.source.toString(),
        offset: this.offset, // 获取的页码
        limit: this.limit // 每页的数据量
      })
      const { results } = data.data
      this.list.push(...results)

      this.$emit('update-total-count', data.data.total_count)
      // 关闭本次评论加载
      this.loading = false

      // 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.cellGroup {
  margin: 10px 20px 0 20px;
  .van-cell {
    background-color: rgba(255, 255, 255, 0.4);
    border: 1px solid #9ebfe0;
    box-shadow: none;
    border-radius: 24px;
    margin: 4px 0;
    color: white;
    font-size: 16px;
  }
  .bigTitle {
    color: white;
    font-size: 28px;
    text-align: center;
  }
}
/deep/.van-list__finished-text {
  color: white !important;
}
.xian {
  width: 320px;
  background-color: white;
  height: 1px;
  margin: 0 auto;
  margin: -20px 0 20px 0;
}
</style>
