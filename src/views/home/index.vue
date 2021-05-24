<template>
  <div class="home-container">
    <van-nav-bar class="nav-bar" left-text="宇龙头条" @click-left="onClickLeft">
      <template #right>
        <van-button
          slot="title"
          color="#88c1fa"
          round
          icon="search"
          class="search-btn"
          size="small"
          @click="searchPopupIsShow = true"
          >搜索</van-button
        >
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
        src="https://cdn.dribbble.com/users/1044993/screenshots/15525960/media/ca7447bdd4c1e607f08739c6ad7ff021.png"
      />
    </van-dialog>
    <!-- 对应弹出的dialog结束 -->

    <!-- 下面的标签组件 -->
    <!-- sticky animated swipeable -->
    <van-tabs v-model="active" swipeable sticky animated class="channels-tab">
      <van-tab
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id"
      >
        <article-list :channel="channel"></article-list>
      </van-tab>
      <!-- 汉堡按钮对应位置的站位元素 -->
      <div slot="nav-right" class="hanbao-placeholder"></div>

      <!-- 频道右边的汉堡按钮 -->
      <div slot="nav-right" class="hanbao-btn">
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
      ></channel-edit>
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
      <search ref="sonReset" @closePopup="searchPopupIsShow = false"></search>
    </van-popup>
    <!-- 弹出层结束 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/news";
import ArticleList from "./components/article-list";
import ChannelEdit from "./components/channel-edit-view";
import Search from "./components/search";
import { mapState } from "vuex";
import { getItem } from "@/utils/storeage";

export default {
  name: "Home",
  components: {
    ArticleList,
    ChannelEdit,
    Search
  },
  props: {},
  data() {
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
    };
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    // 点击 宇龙头条 触发的事件
    onClickLeft() {
      this.yulonngIsShow = true;
    },

    // 初始化频道列表
    async loadChannels() {
      let channels = [];

      // 判断用户数是否登录来渲染频道列表
      if (this.user) {
        const { data } = await getUserChannels();
        channels = data.data.channels;
      } else {
        const localData = getItem("user-channels");
        if (localData) {
          channels = localData;
        } else {
          const { data } = await getUserChannels();
          channels = data.data.channels;
        }
      }
      this.channels = channels;
    },
    // 子组件提交的事件，切换频道对应的逻辑
    close() {
      this.popupIsShow = false;
    },
    onTabSwitch(id) {
      this.active = id;
    },
    closePopup() {
      this.$refs.channelEdit.isClearShow = false;
    },
    // 向子组件传值
    sonSousuoReset() {
      this.$refs.sonReset.sonResetSousuo();
    }
  }
};
</script>

<style lang="less" scoped>
.nav-bar {
  /deep/.van-nav-bar__text {
    margin-left: 18px;
  }
  /deep/.van-nav-bar__text {
    font-size: 22px;
    font-weight: 700;
    color: white;
  }
  background-color: #2892ff;
  .van-button__icon {
    font-size: 20px;
    font-weight: 700;
    color: white;
  }
  .search-btn {
    width: 180px;
    font-size: 12px;
    margin-right: 20px;
  }
}

// 宇龙头条弹出样式
/deep/.van-dialog__header {
  font-size: 20px;
  font-weight: 700;
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
  font-weight: 700;
}
/deep/.van-grid-item__content {
  background-color: #f3f5f7;
  height: 52px !important;
  .van-grid-item__text {
    font-size: 13px;
    margin-top: 0;
  }
}
</style>
