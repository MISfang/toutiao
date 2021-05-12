<template>
  <div class="login-container">
    <!-- 最上面的蓝色导航栏 -->
    <van-nav-bar
      title="登录/注册"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
    />

    <!-- 轮播图 -->
    <div class="my-swipe-container">
      <van-swipe autoplay="2000" class="my-swipe">
        <van-swipe-item v-for="(image, index) in swiperImgs" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 轮播图结束 -->

    <!-- 下面的输入框 -->
    <van-form
      class="text-container"
      :show-error="false"
      :show-error-message="false"
      validate-first
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.moblie"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <!-- 插入按钮 -->
        <template #button>
          <van-button size="small" type="info" round>
            发送验证码
          </van-button>
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <van-button type="info" round icon="flag-o" block class="login-button">
        登录
      </van-button>
    </van-form>
    <!-- 下面的输入框结束 -->
  </div>
</template>

<script>
import { login } from "@/api/user";
import { Toast } from "vant";

export default {
  name: "Login",
  components: {},
  props: {},
  data() {
    return {
      user: {
        // 用户登录绑定的数据
        moblie: "",
        code: ""
      },

      swiperImgs: [
        "https://cdn.dribbble.com/users/518045/screenshots/15638080/media/ca4a5f8758278f716927f0d051ef17cb.png",
        "https://cdn.dribbble.com/users/518045/screenshots/14770233/media/a72f3528258ee45d8fa2414580f11454.png",
        "https://cdn.dribbble.com/users/518045/screenshots/15554040/media/4c5a3cd8413f3395dd011bfdfa805a19.png?compress=1&resize=800x600",
        "https://cdn.dribbble.com/users/518045/screenshots/15310594/media/faa9833e334e03d91b558c7f25fe16aa.png?compress=1&resize=800x600",
        "https://cdn.dribbble.com/users/518045/screenshots/14547444/media/0fd39201d0aa39729a3869c3fd0d15a3.png?compress=1&resize=800x600"
      ],
      // 表单验证规则
      formRules: {
        mobile: [
          { required: true, message: "请输入手机号" },
          {
            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: "请输入有效的手机号码"
          }
        ],
        code: [
          { required: true, message: "请输入验证码" },
          {
            pattern: /^\d{6}}$/,
            message: "请输入6位数字验证码"
          }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 登录对应方法
    async onLogin() {
      // 触发登录中提示
      Toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0
      });
      try {
        const res = await login(this.user);
        console.log(res);
        Toast({
          message: "成功登录",
          icon: "like-o"
        });
      } catch (err) {
        Toast.fail("用户未注册或者验证码有误");
        console.log("验证码有误，登录失败", err);
      }
    },

    // 拿到验证不通过的数据
    onFailed(error) {
      if (error.errors[0]) {
        Toast({
          message: error.errors[0].message,
          position: "top"
        });
      }
    }
  }
};
</script>

<style lang="less">
.text-container {
  margin: 20px 10px 0 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
.login-button {
  width: 80%;
  display: flex;
  justify-content: center;
  margin: 15px auto 0;
  background-color: #6db4fb;
  border: none;
  .van-button__text {
    font-size: 18px;
    font-weight: 700;
  }
}
// 轮播图样式调整

.my-swipe-container {
  width: 375px;
  height: 281.25px;
}
.my-swipe .van-swipe-item img {
  width: 100%;
  height: 100%;
}
</style>
