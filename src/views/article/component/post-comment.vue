<template>
  <div class="post-comment">
    <van-field
      v-model="pinglunMessage"
      rows="3"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="在这里写评论"
      show-word-limit
      class="input"
    />
    <div class="btn-warp">
      <van-button
        round
        type="info"
        class="button"
        @click="onfabu"
      >
        发布
      </van-button>
    </div>
  </div>
</template>

<script>
import { addComments } from '@/api/comment'
export default {
  name: 'PostComment',
  props: {
    target: {
      type: [String, Object, Number],
      required: true
    },

    // 如何使评论回复，也需要传这个值
    articleId: {
      type: [String, Object, Number],
      default: null
    }
  },
  data () {
    return {
      // 评论的内容
      pinglunMessage: ''
    }
  },
  methods: {
    // 发布评论的方法
    async onfabu () {
      if (this.pinglunMessage === '') {
        this.$notify({
          type: 'primary',
          message: '发布内容不能为空',
          duration: 1.5 * 1000
        })
      } else {
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          message: '评论发布中...',
          forbidClick: true
        })

        const articleId = this.articleId ? this.articleId.toString() : null

        const { data } = await addComments({
          target: this.target.toString(),
          content: this.pinglunMessage,
          art_id: articleId
        })
        // 获取发布数据成功，向父组件提交事件
        this.$emit('post-success', data.data.new_obj)
        // 发布成功以后展示一下成功提示
        if (data) {
          this.$toast.success({
            message: '发布成功！',
            duration: 1200
          })
          this.pinglunMessage = ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.post-comment {
  .input {
    background-color: rgba(255, 255, 255, 0.5);
    margin: 48px 10px 6px 10px;
    width: 95%;
    border-radius: 8px;
  }

  /deep/.van-field__control {
    color: rgb(83, 83, 83) !important;
    font-size: 18px;
  }

  .btn-warp {
    width: 375px;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .button {
      width: 250px;
      height: 35px;
      margin-top: 5px;
      color: white;
      font-size: 18px;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6);
    }
  }
}
</style>
