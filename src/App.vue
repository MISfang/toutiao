<template>
  <div id="app">
    <!-- 路由站位符 -->
    <keep-alive :include="cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script type="text/javascript">
window.$crisp = []
window.CRISP_WEBSITE_ID = 'c18e4f99-bdba-4555-b7dd-65c2bc9e2e67';
(function () {
  d = document
  s = d.createElement('script')
  s.src = 'https://client.crisp.chat/l.js'
  s.async = 1
  d.getElementsByTagName('head')[0].appendChild(s)
})()
</script>

<style lang="less">
@import "./styles/stylesheet.css";
body {
  font-family: "adidasi" !important;
}
</style>
