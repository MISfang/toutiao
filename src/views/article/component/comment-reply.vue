<template>
  <div class="container">
    <van-sticky :offset-top="66.52">
      <van-nav-bar
        :title="`${reply_count}条回复`"
        class="top-title"
      />
      <comment-item :item="replyTargetComment" />
      <van-cell
        title="↑该评论所有回复 ↓"
        class="huifu"
      />
    </van-sticky>

    <div class="bottom">
      <comment-list
        :source="replyTargetComment.com_id"
        type="c"
        :list="commentList"
      />
      <div class="ph" />
    </div>

    <!-- 底部的写评论区域 -->
    <div class="pinlun">
      <van-button
        color="#1989fa"
        round
        class="pinlun-btn"
        @click="popupIsShow = true"
      >
        写评论
      </van-button>
    </div>

    <!-- 写评论时候的弹出层 -->
    <van-popup
      v-model="popupIsShow"
      round
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '32%' }"
    >
      <!-- 写评论区域的内容 -->
      <post-comment
        :target="com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>
<script>
import commentItem from '@/views/article/component/comment-item'
import commentList from '@/views/article/component/comment-list'
import postComment from '@/views/article/component/post-comment'

export default {
  name: 'CommentReply',
  components: {
    commentItem,
    commentList,
    postComment
  },
  data () {
    return {
      ...this.replyTargetComment,
      // 控制写回复评论的falg
      popupIsShow: false,
      commentList: []
    }
  },
  props: {
    replyTargetComment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [String, Object, Number],
      required: true
    }
  },
  methods: {
    onPostSuccess (comment) {
      this.commentList.unshift(comment)
      this.reply_count++
      this.popupIsShow = false
      this.$notify({
        type: 'success',
        message: `该评论的回复数量现为${this.reply_count}条`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  /deep/.van-sticky {
    background: linear-gradient(to right, #0052d4, #4364f7, #6fb1fc);
  }
  /deep/.van-sticky--fixed {
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.6);
    border-radius: 15px 15px 0 0;
  }
  .top-title {
    border-bottom: 2px solid white;
    background-color: rgba(255, 255, 255, 0) !important;
    /deep/.van-nav-bar__title {
      color: white;
      font-size: 20px;
    }
  }
  /deep/.comment-item {
    background-color: rgba(255, 255, 255, 0.4);
    border: 1px solid #9ebfe0;
    box-shadow: none;
    border-radius: 24px;
    margin: 15px auto 10px;
    color: white;
    font-size: 16px;
    width: 94%;
  }
  .huifu {
    background-color: rgba(255, 255, 255, 0) !important;
    color: white;
    font-size: 20px;
    letter-spacing: 2px;
  }
  /deep/.van-list__placeholder {
    height: 20px;
  }

  .ph {
    width: 100%;
    height: 30px;
  }
  // 下面的评论样式
  .pinlun {
    height: 40px;
    width: 375px !important;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 40px;
    position: fixed;
    bottom: 0;
    display: flex;
    padding: 4px 0 1px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .pinlun-btn {
      width: 240px;
      height: 40px;
      font-size: 16px;
      letter-spacing: 2px;
    }
  }
}
</style>
