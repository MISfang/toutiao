<template>
  <div>
    文章详情页面
  </div>
</template>

<script>
export default {
  name: "ArticleIndex",
  props: {
    articleId: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="less" scoped></style>
