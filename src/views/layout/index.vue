<template>
  <div class="layout-contaner">
    <!-- 路由站位符 -->
    <keep-alive>
      <router-view />
    </keep-alive>

    <!-- 下面的底部导航栏 -->
    <van-tabbar
      v-model="active"
      active-color="#ee0a24"
      inactive-color="#2d2b55"
      route
    >
      <van-tabbar-item replace to="/" icon="home-o">
        首页
      </van-tabbar-item>
      <van-tabbar-item replace to="/qa" icon="fire-o" badge="20">
        问答
      </van-tabbar-item>
      <van-tabbar-item replace to="/video" icon="play-circle-o" dot>
        视频
      </van-tabbar-item>
      <van-tabbar-item replace to="/my" icon="manager-o" badge="4">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {
      active: "home"
    };
  },
  mounted() {
    this.$store.commit("addCachePage", "Layout");
  }
};
</script>

<style lang="less" scoped></style>
