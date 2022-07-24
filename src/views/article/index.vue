<template>
  <div>
    <!-- 加载内容时候的遮罩层 -->
    <van-overlay :show="zhezhashow">
      <van-loading
        color="#0094ff"
        class="wrapper"
        vertical
      >
        正在加载文章...
      </van-loading>
    </van-overlay>
    <!-- 最上面的蓝色导航栏 -->

    <van-nav-bar
      title="文章内容"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
    />
    <div class="placeholder" />

    <!-- 下面的正文卡片 -->
    <div class="bgc">
      <div class="card-container">
        <h2 class="title">
          {{ data.title }}
        </h2>
        <!-- 粘性布局 -->
        <van-sticky :offset-top="30">
          <van-cell
            :title="data.aut_name"
            class="author"
            center
          >
            <van-image
              slot="icon"
              width="50"
              height="50"
              fit="cover"
              round
              :src="data.aut_photo"
              class="author-img"
            />
            <div slot="label">
              {{ data.pubdate | relativeTime }}
            </div>
            <van-button
              :icon="data.is_followed ? '' : 'plus'"
              :type="data.is_followed ? 'default' : 'info'"
              round
              slot="right-icon"
              class="button"
              @click="handleUserFollow"
              :loading="isGuanzhuLoading"
              loading-type="spinner"
            >
              {{ data.is_followed ? "取消关注" : "关注" }}
            </van-button>
          </van-cell>
        </van-sticky>

        <div class="xian" />
        <!-- 下面的正文内容 -->
        <div
          class="textcontent markdown-body"
          v-html="data.content"
          ref="article_content"
        />
      </div>

      <!-- 文章评论列表 -->
      <comment-list
        :source="articleId"
        @update-total-count="total_count = $event"
        :list="newCommentList"
        @reply="onReply"
      />
      <!-- 文章评论列表 -->
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
      <!-- 右边的徽标 -->
      <van-icon
        size="28"
        name="chat-o"
        :badge="total_count"
      />
      <van-icon
        size="28"
        :name="data.is_collected ? 'star' : 'star-o'"
        :color="data.is_collected ? '#ee0a24' : ''"
        @click="Onshoucang"
      />
      <van-icon
        size="28"
        :name="data.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="data.attitude === 1 ? '#ee0a24' : ''"
        @click="Ondianzan"
      />
      <van-icon
        size="28"
        name="share"
        @click="showShare = true"
      />
    </div>

    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />

    <!-- 再往下，写评论时候的弹出层 -->
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
        :target="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>

    <!-- 再往下评论回复的弹出层 -->
    <van-popup
      round
      v-model="isReplyShow"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '90%' }"
    >
      <comment-reply
        :article-id="articleId"
        v-if="isReplyShow"
        :reply-target-comment="replyTargetComment"
      />
    </van-popup>

    <!-- 回到顶部按钮 -->
    <vm-back-top
      :height="300"
      :bottom="55"
      :right="20"
      :duration="2000"
      timing="ease"
    >
      <div class="back-top">
        <van-icon
          name="fire"
          color="#2892ff"
          size="48"
        />
        <span class="text">返回顶部</span>
      </div>
    </vm-back-top>
  </div>
</template>

<script>
import { detailArticle } from '@/api/news'
import './github-markdown.css'
import VmBackTop from 'vue-multiple-back-top'
import {
  addFollow,
  deleteFollow,
  colected,
  deleteColected
} from '@/api/user'
// 图片预览组件
import { ImagePreview, Toast } from 'vant'
import commentList from '@/views/article/component/comment-list'
import postComment from '@/views/article/component/post-comment'
import commentReply from '@/views/article/component/comment-reply'
export default {
  name: 'ArticleIndex',
  data () {
    return {
      data: {},

      // 控制遮罩显示的flag
      zhezhashow: false,

      // 预览图片地址数组
      ImgSrc: [],

      // 关注用户按钮的loading状态
      isGuanzhuLoading: false,

      // 接受子组件的评论总数量
      total_count: null,

      // 弹出层是否展示的flag
      popupIsShow: false,

      // 生成新的品论列表
      newCommentList: [],

      // 控制分享面板是否展示的falg
      showShare: false,
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ],

      // 评论回复的展示开关
      isReplyShow: false,
      replyTargetComment: {}
    }
  },
  components: {
    commentList,
    postComment,
    VmBackTop,
    commentReply
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    // 加载文章内容
    async loadArticle () {
      this.zhezhashow = true
      const { data } = await detailArticle(this.articleId)
      this.data = data.data
      if (this.data) {
        this.zhezhashow = false
      }
      // 图片预览处理方法
      this.$nextTick(() => {
        this.handleImage()
      })
    },

    // 处理图片预览的方法
    handleImage () {
      const articleContent = this.$refs.article_content
      const allImg = articleContent.querySelectorAll('img')
      const imgPaths = []
      allImg.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = () => {
          // 调用vant组件的预览图片的方法
          ImagePreview({
            images: imgPaths,
            closeable: true,
            startPosition: index,
            swipeDuration: 500,
            showIndicators: true,
            maxZoom: 10,
            minZoom: 0.1,
            closeIcon: 'close'
          })
        }
      })
    },

    // 用户关注的方法
    async handleUserFollow () {
      this.isGuanzhuLoading = true
      if (this.data.is_followed) {
        await deleteFollow(this.data.aut_id)
        Toast.success('取消成功！')
      } else {
        await addFollow(this.data.aut_id)
        Toast.success('关注成功！')
      }
      this.data.is_followed = !this.data.is_followed
      this.isGuanzhuLoading = false
    },

    // 收藏文章的方法
    async Onshoucang () {
      this.$toast.loading({
        message: '稍等...',
        forbidClick: true
      })
      if (this.data.is_collected) {
        await deleteColected(this.articleId)
      } else {
        await colected(this.articleId)
      }
      this.data.is_collected = !this.data.is_collected
      Toast({
        type: 'success',
        message: `${this.data.is_collected ? '' : '取消'}收藏成功`
      })
    },

    // 点赞文章的方法
    async Ondianzan () {
      this.$toast.loading({
        message: '稍等...',
        forbidClick: true
      })
      if (this.data.attitude === 1) {
        await deleteColected(this.articleId)
        this.data.attitude = -1
      } else {
        await colected(this.articleId)
        this.data.attitude = 1
      }
      Toast({
        type: 'success',
        message: `${this.data.attitude === 1 ? '' : '取消'}点赞成功`
      })
    },

    // 处理子组件发布评论的方法
    onPostSuccess (newCommentObj) {
      // 成功获取数据以后先关闭写评论的弹出层
      this.popupIsShow = false
      // 再把评论对象添加到评论列表最上面
      this.newCommentList.unshift(newCommentObj)
      // 再把品论总数量加一
      this.total_count++
    },

    // 点击了评论回复的方法
    onReply (comment) {
      this.replyTargetComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.app-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.placeholder {
  width: 100%;
  height: 45px;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.bgc {
  width: 100%;
  background: linear-gradient(to right, #0052d4, #4364f7, #6fb1fc);
  margin-top: 0px;
  margin-bottom: -1px;
  min-height: 581px;
  padding-top: 40px;
  padding: 0 0 40px 0;
  overflow: hidden;

  .card-container {
    overflow: hidden;
    margin: 40px auto 10px;
    padding: 0 0 30px 0;
    border-radius: 20px;
    width: 88%;
    background-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0.2em 0.4em 2em rgba(0, 0, 0, 0.8);

    .title {
      font-size: 22px;
      color: black;
      margin-left: 20px;
      margin-right: 20px;
      text-align: justify;
    }

    /deep/.van-cell {
      max-width: 330px;
      margin: 0 auto;
      width: 94%;
      border-radius: 20px;
      background-color: rgba(255, 255, 255, 0.5);
      box-shadow: 0.1em 0.1em 1em rgba(0, 0, 0, 0.1);
    }

    .author {
      margin-top: 20px;

      /deep/.van-cell__title {
        font-size: 16px;

        span {
          display: block;
          margin-bottom: 5px;
        }
      }

      /deep/.van-cell__label {
        font-size: 10px;
      }

      .author-img {
        margin-right: 15px;
        margin-left: -5px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.4);
        border: 2px solid white;
      }

      .button {
        min-width: 90px;
        height: 35px;
        box-shadow: 0.1em 0.1em 1em rgba(0, 0, 0, 0.2);
      }
    }

    // 中间的分割线
    .xian {
      width: 94%;
      height: 3px;
      background-color: #2892ff;
      margin: 30px auto;
      box-shadow: 0.1em 0.1em 1em rgba(0, 0, 0, 0.8);
    }

    // 下面的1正文样式
    .textcontent {
      letter-spacing: 2px;
      font-size: 15px;
      margin: 25px 20px 0;
      text-align: justify;
    }
  }
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
  justify-content: space-evenly;
  align-items: center;

  .pinlun-btn {
    width: 140px;
    height: 40px;
    font-size: 16px;
    letter-spacing: 2px;
  }

  /deep/.van-list {
    margin-bottom: 20px;
  }
}

/deep/.van-popup {
  background: linear-gradient(to right, #0052d4, #4364f7, #6fb1fc);
}

// 回到顶部的按钮样式
.back-top {
  width: 60px;
  padding-bottom: 10px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.4);

  .text {
    font-size: 13px;
    text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }
}

/deep/.van-share-sheet__name {
  color: white;
}

/deep/.van-share-sheet__title {
  color: white;
  font-size: 20px;
}

/deep/.van-share-sheet__options {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

/deep/.van-share-sheet__cancel {
  font-size: 24px;
  background-color: rgba(255, 255, 255, 0.4) !important;
  border-radius: 20px 20px 0 0;
}

/deep/.van-share-sheet__cancel::before {
  background-color: rgba(255, 255, 255, 00) !important;
}

/deep/.van-popup__close-icon {
  font-size: 32px;
  margin-top: -8px;
  margin-bottom: 2px;
  color: white;
  font-weight: 700;
  position: absolute;
  top: 20px;
}
</style>
