<template>
  <div id="app">
    <!-- 路由站位符 -->
    <keep-alive :include="cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    ...mapState(["cachePages"])
  }
};
</script>

<style lang="less">
@import "./styles/stylesheet.css";
body {
  font-family: "adidasi" !important;
}
</style>
