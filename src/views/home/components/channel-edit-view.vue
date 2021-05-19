<template>
  <div class="channel-edit">
    <van-cell>
      <div slot="title" class="title">我的频道</div>
      <van-button
        round
        type="info"
        icon="edit"
        class="edit-btn"
        size="small"
        @click="isClearShow = !isClearShow"
        >{{ isClearShow ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <!-- 下面的用户已选择的频道列表 -->
    <van-grid :gutter="6">
      <van-grid-item
        v-for="(channel, index) in channels"
        :key="index"
        :text="channel.name"
        class="channel-grid "
        :class="{ active: active === index, shadow: isClearShow }"
        :icon="isClearShow && index !== 0 ? 'clear' : ''"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>
    <div class="top-placeHA"></div>
    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 10px' }"
    >
      分割线
    </van-divider>

    <!-- 再往下用户未选中的频道 -->
    <van-cell class="placeHB">
      <div slot="title" class="title">其他频道</div>
    </van-cell>
    <!-- 下面的用户已未选中的频道列表 -->
    <van-grid :gutter="6">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        class="channel-grid"
        @click="onAdd(channel)"
      />
    </van-grid>
    <div class="placeHolder"></div>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from "@/api/news";
import { mapState } from "vuex";
import { getItem, setItem, removeItem } from "@/utils/storeage";

export default {
  name: "ChannelDeit",
  props: {
    channels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      // 控制右上角x号显示的flag
      isClearShow: false
    };
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },

    // 添加点击事件
    async onAdd(channel) {
      this.channels.push(channel);

      // 做一下数据持久化
      if (this.user) {
        // 登录了
        console.log(channel.id);
        console.log(this.channels.length);
        await addUserChannels([
          {
            id: channel.id,
            seq: this.channels.length
          }
        ]);
      } else {
        // 未登录
        setItem("user-channels", this.channels);
      }
    },

    // 添加删除或者切换列表的方法
    onUserChannelClick(channel, id) {
      if (this.isClearShow === true && id !== 0) {
        this.deleteChannel(channel, id);
      } else if (this.isClearShow === false) {
        this.swicthChannel(id);
      }
    },

    // 对应删除频道的方法
    async deleteChannel(channel, id) {
      if (id <= this.active) {
        this.$emit("switch", this.active - 1);
      }
      this.channels.splice(id, 1);

      if (this.user) {
        // 线上持久化
        await deleteUserChannels(channel.id);
      } else {
        // 线下持久化
        setItem("user-channels", this.channels);
      }
    },

    // 对应切换频道的逻辑
    swicthChannel(id) {
      console.log("切换");
      this.$emit("close");
      this.$emit("switch", id);
    }
  },
  computed: {
    ...mapState(["user"]),

    // 计算剩余的频道列表
    recommendChannels() {
      return this.allChannels.filter(channel => {
        return !this.channels.find(userChannel => {
          return userChannel.id === channel.id;
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 40px 10px 0;
  .title {
    height: 46px;
    line-height: 36px;
    font-size: 18px;
    font-weight: 700;
    color: #227bd7;
  }
  .edit-btn {
    width: 100px;
    height: 36px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
  }
}

.channel-grid {
  position: relative;
  /deep/.van-grid-item__icon {
    position: absolute;
    top: -6px;
    right: -6px;
    font-size: 20px;
    color: #1989fa;
    z-index: 10;
  }
}

.placeHolder {
  height: 40px;
}
.top-placeHA {
  width: 100%;
  height: 10px;
}
.placeHB {
  margin-top: -20px;
}

.shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.12);
}
.active {
  /deep/.van-grid-item__text {
    color: #1989fa;
    font-weight: 700;
    font-size: 24px;
  }
}
</style>
