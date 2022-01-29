<template>
  <div class="home-container">
    <van-nav-bar
      class="nav-bar"
      left-text="宇龙头条"
      @click-left="onClickLeft"
    >
      <template #right>
        <van-button
          slot="title"
          color="#88c1fa"
          round
          icon="search"
          class="search-btn"
          size="small"
          @click="searchPopupIsShow = true"
        >
          搜索
        </van-button>
      </template>
    </van-nav-bar>

    <!-- 对应弹出的dialog -->
    <van-dialog
      v-model="yulonngIsShow"
      title="欢迎使用宇龙头条！"
      confirm-button-color="#2892ff"
      confirm-button-text="加油啊！"
      theme="round-button"
      :close-on-click-overlay="true"
    >
      <van-image
        fit="cover"
        src="./Snipaste_2022-01-17_16-10-29.png"
      />
    </van-dialog>
    <!-- 对应弹出的dialog结束 -->

    <!-- 下面的标签组件 -->
    <!-- sticky animated swipeable -->
    <van-tabs
      v-model="active"
      swipeable
      sticky
      animated
      class="channels-tab"
    >
      <van-tab
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id"
      >
        <article-list
          ref="setTop"
          :channel="channel"
          id="list"
        />
      </van-tab>
      <!-- 汉堡按钮对应位置的站位元素 -->
      <div
        slot="nav-right"
        class="hanbao-placeholder"
      />

      <!-- 频道右边的汉堡按钮 -->
      <div
        slot="nav-right"
        class="hanbao-btn"
      >
        <van-icon
          name="wap-nav"
          color="#ee0a24"
          size="32"
          @click="popupIsShow = true"
        />
      </div>
    </van-tabs>
    <!-- 下面的标签组件结束 -->

    <!-- 编辑频道时候的弹出层 -->
    <van-popup
      v-model="popupIsShow"
      position="left"
      :style="{ height: '100%', width: '85%' }"
      closeable
      close-icon="close"
      close-icon-position="top-left"
      round
      duration="0.4"
      get-container="body"
      @close="closePopup"
    >
      <channel-edit
        :channels="channels"
        @close="close"
        @switch="onTabSwitch"
        :active="active"
        ref="channelEdit"
      />
    </van-popup>

    <!-- 搜索对应的弹出层页面 -->
    <van-popup
      v-model="searchPopupIsShow"
      position="bottom"
      :style="{ height: '92%' }"
      round
      duration="0.4"
      get-container="body"
      @closed="sonSousuoReset"
    >
      <!-- 对应的搜索页组件 -->
      <search
        ref="sonReset"
        @closePopup="searchPopupIsShow = false"
      />
    </van-popup>
    <!-- 弹出层结束 -->

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
import { getUserChannels } from '@/api/news'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit-view'
import Search from './components/search'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storeage'
import VmBackTop from 'vue-multiple-back-top'

export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit,
    Search,
    VmBackTop
  },
  props: {},
  data () {
    return {
      // 控制宇龙头条显示的flag
      yulonngIsShow: false,
      // 初始标签值
      active: 0,
      // 拿到的当前登录用户的频道列表、
      channels: [],

      // 控制弹出层的flag
      popupIsShow: false,
      // 控制搜索框的弹出层
      searchPopupIsShow: false
    }
  },
  computed: {
    ...mapState(['user', 'user2'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    // 点击 宇龙头条 触发的事件
    onClickLeft () {
      this.yulonngIsShow = true
    },

    // 初始化频道列表
    async loadChannels () {
      let channels = []

      // 判断用户是否登录来渲染频道列表
      // if (this.user) {
      //   const { data } = await getUserChannels();
      //   channels = data.data.channels;
      // } else {
      const localData = getItem('user-channels')
      if (localData) {
        channels = localData
      } else {
        const { data } = await getUserChannels()
        channels = data.data.channels
      }
      // }
      this.channels = channels
    },
    // 子组件提交的事件，切换频道对应的逻辑
    close () {
      this.popupIsShow = false
    },
    onTabSwitch (id) {
      this.active = id
    },
    closePopup () {
      this.$refs.channelEdit.isClearShow = false
    },
    // 向子组件传值
    sonSousuoReset () {
      this.$refs.sonReset.sonResetSousuo()
    }
  }
}
</script>

<style lang="less" scoped>
.nav-bar {
  /deep/.van-nav-bar__text {
    margin-left: 18px;
  }
  /deep/.van-nav-bar__text {
    font-size: 22px;
    color: white;
  }
  background-color: #2892ff;
  .van-button__icon {
    font-size: 20px;
    font-weight: 700;
    color: white;
  }
  .search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    font-size: 14px;
    letter-spacing: 4px;
    margin-right: 30px;
  }
}

// 宇龙头条弹出样式
/deep/.van-dialog__header {
  font-size: 20px;
  color: #2892ff;
  margin-bottom: 10px;
}

/deep/.van-tabs__line {
  background-color: #2892ff;
  height: 6px;
  margin-bottom: -2px;
}
.channels-tab {
  /deep/.van-tab {
    border-right: 2px solid #dedff3;
    border-bottom: 1px solid #dedff3;
  }
}

// 汉堡按钮的样式
.hanbao-btn {
  position: fixed;
  right: 0px;
  height: 43px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  opacity: 0.8;
  padding-right: 6px;
  border-left: 1px solid #ccc;
}
.hanbao-placeholder {
  width: 42px;
  flex-shrink: 0;
}
/deep/.van-popup__close-icon {
  font-size: 26px;
  color: #1989fa;
}
/deep/.van-grid-item__content {
  background-color: #f3f5f7;
  height: 52px !important;
  .van-grid-item__text {
    font-size: 13px;
    margin-top: 0;
  }
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

/deep/.van-sticky--fixed {
  border-radius: 15px 15px 0 0;
}
</style>
