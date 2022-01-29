<template>
  <div class="my-container">
    <!-- 上面的基本信息栏 -->
    <van-cell-group
      class="my-info"
      v-if="user"
    >
      <van-cell
        title="单元格"
        value="内容"
        center
        class="base-info"
        :border="false"
      >
        <van-image
          slot="icon"
          :src="user_data.photo"
          round
          fit="cover"
          class="avatar"
        />
        <div
          slot="title"
          class="name"
        >
          {{ user_data.name }}
        </div>
        <van-button
          size="small"
          round
          type="info"
          class="update-btn"
          plain
          to="/user/profile"
        >
          编辑资料
        </van-button>
      </van-cell>

      <!-- 下面的数据信息栏 -->
      <van-grid
        :border="false"
        class="data-info"
      >
        <van-grid-item
          text="头条"
          class="data-info-item"
        >
          <span slot="icon">{{ user_data.art_count }}</span>
        </van-grid-item>
        <van-grid-item
          text="关注"
          class="data-info-item"
        >
          <span slot="icon">{{ user_data.follow_count }}</span>
        </van-grid-item>
        <van-grid-item
          text="粉丝"
          class="data-info-item"
        >
          <span slot="icon">{{ user_data.fans_count }}</span>
        </van-grid-item>
        <van-grid-item
          text="获赞"
          class="data-info-item"
        >
          <span slot="icon">{{ user_data.like_count }}</span>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 这里是未登录的样式 -->
    <div
      class="not-login"
      v-else
      @click="$router.push('/login')"
    >
      <img
        src="./头像.png"
        class="mobile"
      >
      <span class="text">登录/注册</span>
    </div>

    <!-- 下面的收藏表 -->
    <van-grid
      :column-num="2"
      class="nav-grid"
    >
      <van-grid-item
        @click="
          fenSiIsShow = true;
          type = 1;
        "
        class="nav-grid-item"
        icon="like-o"
        text="粉丝列表"
      />
      <van-grid-item
        @click="
          guanZhuIsSHow = true;
          type = 2;
        "
        class="nav-grid-item"
        icon="add-o"
        text="关注列表"
      />
    </van-grid>
    <van-grid
      :column-num="3"
      class="nav-grid"
    >
      <van-grid-item
        @click="
          allArtIsShow = true;
          type2 = 1;
        "
        class="nav-grid-item"
        icon="label-o"
        text="我的文章"
      />
      <van-grid-item
        class="nav-grid-item"
        icon="star-o"
        text="我的收藏"
        @click="
          allColIsShow = true;
          type2 = 2;
        "
      />
      <van-grid-item
        class="nav-grid-item"
        icon="underway-o"
        text="浏览历史"
        @click="
          allHisIsShow = true;
          type2 = 3;
        "
      />
    </van-grid>

    <!-- 下面的导航跳转 -->
    <van-cell
      title="小智同学"
      is-link
      to="/chat"
      class="nav-to"
    />

    <!-- 最下的退出登录 -->
    <van-button
      type="warning"
      block
      round
      class="loginout_button"
      v-if="user"
      @click="onloginout"
    >
      退出登录
    </van-button>

    <!-- 再往下对应功能页面的弹出层 -->
    <van-popup
      v-model="guanZhuIsSHow"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <guanzhu
        :id="user_data.id"
        :type="type"
      />
    </van-popup>
    <!-- 粉丝的弹出层 -->

    <van-popup
      v-model="fenSiIsShow"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <guanzhu
        :id="user_data.id"
        :type="type"
      />
    </van-popup>

    <!-- 用户全部文章列表 -->
    <van-popup
      v-model="allArtIsShow"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <newArtList :type="type2" />
    </van-popup>
    <!-- 用户收藏的弹出层 -->
    <van-popup
      v-model="allColIsShow"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <newArtList :type="type2" />
    </van-popup>
    <van-popup
      v-model="allHisIsShow"
      closeable
      close-icon="close"
      position="bottom"
      :style="{ height: '80%' }"
      round
    >
      <newArtList :type="type2" />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'
import guanzhu from '@/views/my/component/guanzhu'
import newArtList from '@/views/my/component/newArtList'

export default {
  name: 'My',
  components: { guanzhu, newArtList },
  props: {},
  data () {
    return {
      // 当前登录用户的基本信息
      user_data: {},

      type: 0,
      type2: 0,

      // 对应五个弹出层的开关
      guanZhuIsSHow: false,
      fenSiIsShow: false,
      allArtIsShow: false,
      allColIsShow: false,
      allHisIsShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadCurrentUser()
  },
  mounted () {},
  methods: {
    // 用户退出触发方法
    onloginout () {
      this.$dialog
        .confirm({
          message: '你想好了 确定要退出登录嘛？',
          theme: 'round-button'
        })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    },
    // 在初始化中，获取用户的相应数据
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.user_data = data.data
    }
  }
}
</script>

<style lang="less" scoped>
// 退出登录按钮样式
.loginout_button {
  width: 60%;
  margin: 20px auto 0;
  font-size: 16px;
}

.my-container {
  // 未登录注册的样式
  .not-login {
    height: 180px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 70px;
      height: 70px;
      margin-bottom: 10px;
    }
    .text {
      font-size: 14px;
      color: white;
    }
  }
  // 最上面的两行组合在一块的样式
  .my-info {
    background: url("./banner.png") no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      padding-top: 38px;
      padding-bottom: 12px;
      background-color: unset;
      .avatar {
        width: 70px;
        height: 70px;
        border: 2px solid white;
        box-sizing: border-box;
        margin-right: 12px;
      }
      .name {
        font-size: 16px;
        color: white;
      }
      .update-btn {
        width: 90px;
        font-size: 12px;
      }
    }
    .data-info {
      height: 80px;
      .data-info-item {
        font-size: 20px;
        color: white;
        /deep/.van-grid-item__text {
          font-size: 10px;
          color: white;
        }
      }
    }
    /deep/.van-grid-item__content {
      background-color: unset;
    }
  }

  .nav-grid {
    margin-top: 10px;
    border: none;
    .nav-grid-item {
      height: 70px;
      /deep/.van-grid-item__icon {
        font-size: 28px;
        color: #ff6356;
      }
      /deep/.van-grid-item__text {
        font-size: 10px;
        color: #ff6356;
      }
    }
  }
  .nav-to {
    .van-cell__title {
      margin-left: 10px;
      font-size: 14px;
    }
    .van-cell__right-icon {
      margin-right: 10px;
    }
  }
  .A {
    margin-top: 10px;
  }
}
/deep/.van-popup__close-icon {
  font-size: 28px;
  font-weight: 700;
  color: #1989fa;
}
</style>
