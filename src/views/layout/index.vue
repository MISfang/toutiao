<template>
  <div class="layout-contaner">
    <!-- 路由站位符 -->
    <router-view></router-view>

    <!-- 下面的底部导航栏 -->
    <van-tabbar
      v-model="active"
      active-color="#ee0a24"
      inactive-color="#000"
      route
    >
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/qa" icon="fire-o">问答</van-tabbar-item>
      <van-tabbar-item replace to="/video" icon="play-circle-o"
        >视频</van-tabbar-item
      >
      <van-tabbar-item replace to="/my" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "layout",
  data() {
    return {
      active: "home"
    };
  }
};
</script>

<style lang="less" scoped></style>
