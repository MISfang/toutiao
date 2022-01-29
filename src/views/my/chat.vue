<template>
  <div class="user-chat-page">
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    />
    <!-- 聊天列表 -->
    <div
      class="chat-list"
      ref="list"
    >
      <div
        class="chat-item"
        v-for="(item, i) in list"
        :key="i"
        :class="{ left: item.name === 'xz', right: item.name === 'my' }"
      >
        <geek-icon
          v-if="item.name === 'xz'"
          name="xiaozhi"
        />
        <div class="chat-pao">
          {{ item.msg }}
        </div>
        <van-image
          v-if="item.name === 'my'"
          fit="cover"
          round
          :src="myAvatar"
        />
      </div>
    </div>
    <!-- 聊天列表 -->
    <!-- 输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field
        v-model.trim="value"
        left-icon="edit"
        placeholder="请描述您的问题"
      />
      <span
        class="send"
        @click="send()"
      >发送</span>
    </div>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import soekctIO from 'socket.io-client'
const baseURL = 'http://toutiao.itheima.net'
export default {
  name: 'UserChatPage',
  data () {
    return {
      myAvatar: '',
      list: [
        { name: 'xz', msg: '我是小智同学，需要什么帮助吗？' },
        { name: 'my', msg: '我要学前端' }
      ],
      value: ''
    }
  },

  async created () {
    const [, res] = await getUserProfile()
    this.myAvatar = res.data.data.photo
    // 1. 建立连接
    this.io = soekctIO(baseURL, {
      query: {
        token: this.$store.state.user.token
      },
      transports: ['websocket']
    })
    // 2. 连接成功
    this.io.on('connect', () => {
      this.list.push({ name: 'xz', msg: '我是小智同学，需要什么帮助吗？' })
    })
    // 3. 接收消息
    this.io.on('message', data => {
      this.list.push({ name: 'xz', msg: data.msg })
      this.scrollBottom()
    })
  },

  beforeDestroy () {
    // 4. 关闭连接
    this.io.close()
  },

  methods: {
    send () {
      if (!this.value) return this.$toast('请输入内容')
      // 发送消息
      this.io.emit('message', { msg: this.value, timestamp: Date.now() })
      this.list.push({ name: 'my', msg: this.value })
      this.value = ''
      this.scrollBottom()
    },
    scrollBottom () {
      this.$nextTick(() => {
        // 思路：滚动的距离 = 可滚动的高度 - 自身高度
        const scrollHeight = this.$refs.list.scrollHeight
        const offsetHeight = this.$refs.list.offsetHeight
        this.$refs.list.scrollTop = scrollHeight - offsetHeight
      })
    }
  }
}
</script>
<style lang="less" scoped>
.user-chat-page {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fff;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: middle;
        width: 40px;
        height: 40px;
      }
      .geek-icon {
        font-size: 40px;
        line-height: 0;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 20px;
        border-radius: 4px;
        position: relative;
        padding: 10px;
        background-color: #f7f8fa;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 6px;
          height: 6px;
          position: absolute;
          top: 15px;
          background: #f7f8fa;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 10px;
    &::before {
      right: -3px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 10px;
    margin-right: 0;
    &::before {
      left: -3px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 49px;
  width: 100%;
  background: #fff;
  z-index: 9999;
  display: flex;
  align-items: center;
  padding: 0 10px;
  > .van-field {
    flex: 1;
    background: #f7f8fa;
    height: 32px;
    border-radius: 16px;
    padding: 0 10px;
    line-height: 32px;
    ::v-deep .van-field__left-icon .van-icon {
      color: #ccc;
    }
  }
  > .send {
    margin-left: 10px;
    font-size: 14px;
    color: #999;
  }
}
</style>
