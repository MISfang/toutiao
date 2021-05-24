<template>
  <van-cell
    class="article-item"
    :to="{
      name: 'article',
      params: {
        articleId: article.art_id
      }
    }"
  >
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>
    <div slot="label">
      <div class="cover-warp" v-if="article.cover.type === 3">
        <div
          class="cover-warp-iem"
          v-for="(image, index) in article.cover.images"
          :key="index"
        >
          <van-image width="116" height="73" fit="cover" :src="image" />
        </div>
      </div>
      <!-- 下面的作者，发布时间等 -->
      <div class="label-warp">
        <span class="author">{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}条评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>

    <!-- 封面图片是否渲染 -->
    <van-image
      v-if="article.cover.type === 1"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 18px;
    font-weight: 700;
    color: #2892ff;
  }
  /deep/.van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
  }
}

.cover-warp {
  padding: 15px 0;
  display: flex;
  .cover-warp-item {
    flex: 1;
    height: 73px;
    &:not(:last-child) {
      padding-right: 4px;
    }
    .cover-item {
      width: 100%;
      height: 73px;
    }
  }
}
.label-warp {
  font-size: 12px;
  color: #b4b4b4;
  .author {
    font-weight: 700;
    color: tomato;
  }
}
.label-warp span {
  margin-right: 12px;
}
</style>
