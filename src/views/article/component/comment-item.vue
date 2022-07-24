<template>
  <van-cell class="comment-item">
    <!-- 左边内容结束 -->
    <van-image
      slot="title"
      round
      fit="cover"
      :src="item.aut_photo"
      class="aut-img"
    />
    <div
      class="title"
      slot="title"
    >
      <div class="name">
        {{ item.aut_name }}
      </div>
      <div class="content">
        {{ item.content }}
      </div>
      <div class="Scontainer">
        <span
          class="pubdate"
          :class="type !== 'a' ? 'punlun02' : ''"
        >{{
          item.pubdate | datetime("MM-DD HH:ss")
        }}</span>
        <van-button
          v-if="type === 'a'"
          type="info"
          round
          size="small"
          class="recomment-btn"
          plain
          @click="$emit('reply', item)"
        >
          {{ item.reply_count }}回复
        </van-button>
      </div>
    </div>

    <!-- 右边内容 -->

    <div
      class="like-warp"
      v-if="type === 'a'"
    >
      <van-icon
        :name="item.is_liking ? 'like' : 'like-o'"
        :color="item.is_liking ? 'red' : ''"
        size="24"
        @click="ondianzan"
      />
      <span class="like-count">{{ item.like_count }}</span>
    </div>
  </van-cell>
</template>

<script>
import { likeComments, deletelikeComments } from '@/api/comment'
import { Toast } from 'vant'
export default {
  name: 'CommentItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: String
    }
  },
  methods: {
    // 点赞的方法
    async ondianzan () {
      this.$toast.loading({
        message: '稍等...',
        forbidClick: true
      })
      const commentId = this.item.com_id.toString()
      if (this.item.is_liking) {
        await deletelikeComments(commentId)
        this.item.like_count--
      } else {
        await likeComments(commentId)
        this.item.like_count++
      }

      this.item.is_liking = !this.item.is_liking
      Toast({
        type: 'success',
        message: `${this.item.is_liking ? '' : '取消'}点赞成功`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item {
  padding: 10px 12px;

  /deep/.van-cell__title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  /deep/.van-cell__value {
    width: 20px !important;
  }

  .aut-img {
    border: 2px solid white;
    margin-right: 14px;
    width: 48px;
    height: 48px;
  }

  .title {
    width: 140px;

    .name {
      font-size: 10px;
      color: white;
      margin-bottom: 4px;
    }

    .content {
      font-size: 22px;
      color: black;
      margin-bottom: 4px;
    }

    .pubdate {
      font-size: 10px;
      line-height: 14px;
      margin-top: 5px;
    }

    .recomment-btn {
      margin-left: 10px;
      width: 60px;
      height: 25px;
      font-size: 12px;
      background-color: rgba(115, 155, 236, 0.2);
      color: white;
    }
  }

  .Scontainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  .like-warp {
    margin-top: 5px;
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .like-count {
      margin-left: 8px;
      font-size: 18px;
      color: black;
    }
  }
}

.punlun02 {
  margin-left: -71px;
}
</style>
