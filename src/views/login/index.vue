<template>
  <div class="login-container">
    <!-- 最上面的蓝色导航栏 -->
    <van-nav-bar
      title="登录/注册"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
    >
      <template #right>
        <van-button
          type="info"
          plain
          hairline
          round
          @click="popupIsShow = true"
          size="small"
          >查看测试号</van-button
        >
      </template>
    </van-nav-bar>

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
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
        name="mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
        name="code"
      >
        <!-- 插入按钮 -->
        <template #button>
          <van-button
            size="small"
            type="info"
            round
            @click.prevent="onSendSms"
            v-if="isCountDownShow"
            :loading="idSendSmsLoading"
            loading-type="spinner"
            loading-text="验证码发送中..."
          >
            发送验证码
          </van-button>
          <!-- 倒计时组件 -->
          <van-count-down
            :time="1000 * 60"
            format="ss S"
            v-else
            @finish="isCountDownShow = true"
          >
            <template #default="timeData">
              <span class="block">{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
        </template>
      </van-field>

      <!-- 登录按钮 -->
      <van-button type="info" round icon="flag-o" block class="login-button">
        登录
      </van-button>
    </van-form>
    <!-- 下面的输入框结束 -->

    <van-dialog v-model="popupIsShow" title="测试号">
      <van-cell-group inset>
        <van-cell title="13911111111" size="large" value="246810" />
        <van-cell title="13611111111" size="large" value="246810" />
        <van-cell title="13922222222" size="large" value="246810" />
        <van-cell title="17320270567" size="large" value="246810" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user";
import { Toast } from "vant";

export default {
  name: "Login",
  components: {},
  props: {},
  data() {
    return {
      // 控制倒计时是否显示的flag
      isCountDownShow: true,

      // 发送验证码加载状态的显示flag
      idSendSmsLoading: false,

      user: {
        // 用户登录绑定的数据
        mobile: "",
        code: ""
      },
      popupIsShow: false,

      swiperImgs: [
        "https://cdn.dribbble.com/users/418509/screenshots/16215396/media/e7f7e2aee46f09fcf758bb50eef4b424.png",
        "https://cdn.dribbble.com/users/418509/screenshots/14118686/media/c210b0b231be57721526c23343bcd94c.png",
        "https://cdn.dribbble.com/users/418509/screenshots/14091820/media/39a386f211beeec58685eed64f6ef017.png?compress=1&resize=800x600",
        "https://cdn.dribbble.com/users/418509/screenshots/15874779/media/dd5b54e9009fe82c2cdefa3858e2dc80.png?compress=1&resize=1600x1200",
        "https://cdn.dribbble.com/users/418509/screenshots/10074335/media/f3a1301fd8849faba433084260394741.png?compress=1&resize=800x600",
        "https://cdn.dribbble.com/users/418509/screenshots/16016488/media/d588b94050040354aa21ac82738620a5.png?compress=1&resize=1600x1200",
        "https://cdn.dribbble.com/users/418509/screenshots/16185039/media/0b912a71f2d166149c6270ffa730a86b.png?compress=1&resize=1600x1200"
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
            pattern: /^\d{6}$/,
            message: "请输入6位数字验证码"
          }
        ]
      }
    };
  },
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
        const { data } = await login(this.user);
        Toast({
          message: "成功登录",
          icon: "like-o"
        });

        this.$store.commit("setUser", data.data);

        this.$store.commit("removeCachePage", "Layout");

        // 登录成功，跳转到来时的页面
        this.$router.push("/");
      } catch (err) {
        Toast.fail("用户未注册或者验证码有误");
        console.dir("验证码有误，登录失败", err);
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
    },

    // 发送验证码
    async onSendSms() {
      try {
        await this.$refs["login-form"].validate("mobile");

        // 解决网络较慢时，出现瞬时发出多次请求的问题
        this.idSendSmsLoading = true;

        // 验证通过，发送请求
        const res = await sendSms(this.user.mobile);

        // 发送请求的同时，把发送按钮换成倒计时按钮
        this.isCountDownShow = false;
      } catch (err) {
        let message = "";
        if (err && err.response && err.response.status === 429) {
          message = "发送过于频繁，请稍候重试！";
        } else if (err.message === "请输入有效的手机号码") {
          message = err.message;
        } else if (err.message === "请输入手机号") {
          message = err.message;
        } else if (err.message === "Network Error") {
          message = "网络错误，请检查网络连接！";
        } else {
          message = "未知原因，发送失败，请稍候重试！";
        }
        Toast({
          message,
          position: "top"
        });
      }

      // 无论验证码发送成功还是失败，都要关闭loading
      this.idSendSmsLoading = false;
    }
  }
};
</script>

<style lang="less">
.text-container {
  margin: 20px 15px 0 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  padding-bottom: 10px;
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

// 倒计时的样式调整
.block {
  display: inline-block;
  width: 64px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  background-color: #6db4fb;
  font-size: 18px !important;
  border-radius: 14px;
}
</style>
