<template>
  <div class="my-container">
    <!-- 上面的基本信息栏 -->
    <van-cell-group class="my-info" v-if="user">
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
        <div slot="title" class="name">{{ user_data.name }}</div>
        <van-button size="small" round type="info" class="update-btn" plain
          >编辑资料</van-button
        >
      </van-cell>

      <!-- 下面的数据信息栏 -->
      <van-grid :border="false" class="data-info">
        <van-grid-item text="头条" class="data-info-item">
          <span slot="icon">{{ user_data.art_count }}</span>
        </van-grid-item>
        <van-grid-item text="关注" class="data-info-item">
          <span slot="icon">{{ user_data.follow_count }}</span>
        </van-grid-item>
        <van-grid-item text="粉丝" class="data-info-item">
          <span slot="icon">{{ user_data.fans_count }}</span>
        </van-grid-item>
        <van-grid-item text="获赞" class="data-info-item">
          <span slot="icon">{{ user_data.like_count }}</span>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 这里是未登录的样式 -->
    <div class="not-login" v-else @click="$router.push('/login')">
      <img src="./头像.png" class="mobile" />
      <span class="text">登录/注册</span>
    </div>

    <!-- 下面的收藏表 -->
    <van-grid :column-num="2" class="nav-grid">
      <van-grid-item class="nav-grid-item" icon="star-o" text="收藏" />
      <van-grid-item class="nav-grid-item" icon="underway-o" text="浏览历史" />
    </van-grid>

    <!-- 下面的导航跳转 -->
    <van-cell title="消息通知" is-link to="" class="nav-to A" />
    <van-cell title="小智同学" is-link to="" class="nav-to" />

    <!-- 最下的退出登录 -->
    <van-button
      type="warning"
      block
      round
      class="loginout_button"
      v-if="user"
      @click="onloginout"
      >退出登录</van-button
    >
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentUser } from "@/api/user";

export default {
  name: "My",
  components: {},
  props: {},
  data() {
    return {
      // 当前登录用户的基本信息
      user_data: {}
    };
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadCurrentUser();
  },
  mounted() {},
  methods: {
    // 用户退出触发方法
    onloginout() {
      this.$dialog
        .confirm({
          message: "你想好了 确定要退出登录嘛？",
          theme: "round-button"
        })
        .then(() => {
          // on confirm
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    },
    // 在初始化中，获取用户的相应数据
    async loadCurrentUser() {
      const { data } = await getCurrentUser();
      console.log(data);
      this.user_data = data.data;
      console.log(this.user_data);
    }
  }
};
</script>

<style lang="less" scoped>
// 退出登录按钮样式
.loginout_button {
  width: 60%;
  margin: 20px auto 0;
  font-size: 16px;
  font-weight: 700;
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
        font-weight: 700;
        color: white;
      }
      .update-btn {
        width: 90px;
        font-size: 12px;
        font-weight: 700;
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
        font-weight: 700;
      }
    }
  }
  .nav-to {
    .van-cell__title {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 700;
    }
    .van-cell__right-icon {
      margin-right: 10px;
    }
  }
  .A {
    margin-top: 10px;
  }
}
</style>
