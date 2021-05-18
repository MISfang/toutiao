<template>
  <div class="channel-edit">
    <van-cell>
      <div slot="title" class="title">我的频道</div>
      <van-button round type="info" icon="edit" class="edit-btn" size="small"
        >编辑</van-button
      >
    </van-cell>

    <!-- 下面的用户已选择的频道列表 -->
    <van-grid :gutter="6">
      <van-grid-item
        v-for="(channel, index) in channels"
        :key="index"
        :text="channel.name"
        class="channel-grid"
      />
    </van-grid>

    <!-- 再往下用户未选中的频道 -->
    <van-cell>
      <div slot="title" class="title">其他频道</div>
    </van-cell>
  </div>
</template>

<script>
import { getAllChannels } from "@/api/news";

export default {
  name: "ChannelDeit",
  props: {
    channels: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      allChannels: []
    };
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
      console.log(data);
      console.log(this.allChannels);
    }
  }
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 30px 10px 0;
  .title {
    height: 46px;
    line-height: 36px;
    font-size: 18px;
    // margin-left: 10px;
    font-weight: 700;
    color: #227bd7;
  }
  .edit-btn {
    width: 100px;
    height: 36px;
    margin-bottom: 10px;
  }
}
</style>
