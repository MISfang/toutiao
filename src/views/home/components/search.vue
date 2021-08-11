<template>
  <div class="channel-edit">
    <!-- 最上面的搜索 -->
    <van-sticky :offset-top="53.36">
      <div class="placeholder"></div>
      <van-search
        v-model="searchText"
        shape="round"
        background="#2892ff"
        placeholder="请输入搜索关键词"
        clearable
        show-action
        class="search-button"
        @search="onSearch(searchText)"
        @clear="onClear"
      >
        <!-- 右边的按钮 -->
        <template #action>
          <van-button
            plain
            type="info"
            round
            class="right-button"
            @click="onCancel"
            >取消</van-button
          >
        </template>
      </van-search>
    </van-sticky>

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      ref="searchResult"
      :search-text="searchText"
    ></search-result>
    <!-- 联想搜索建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @suggestion="onSearch"
    ></search-suggestion>
    <!-- 历史记录 -->
    <history
      v-else
      ref="history"
      :historyList="historyList"
      @history="onSearch"
      @deleteAllHistory="historyList = $event"
    ></history>
  </div>
</template>

<script>
import searchSuggestion from "@/views/home/components/components/search-suggestion";
import history from "@/views/home/components/components/history";
import searchResult from "@/views/home/components/components/search-result";
import { getItem, setItem } from "@/utils/storeage";
import { searchHistory } from "@/api/search";
import { mapState } from "vuex";

export default {
  name: "ChannelDeit",
  props: {},
  components: {
    searchSuggestion,
    history,
    searchResult
  },
  data() {
    return {
      // 输入框绑定数据
      searchText: null,

      // 控制搜索结果的显示状态
      isResultShow: false,
      historyList: []
    };
  },
  created() {
    this.loadSerachHistory();
  },
  methods: {
    // 点击了回车按钮
    onSearch(searchText) {
      this.isResultShow = true;
      this.searchText = searchText;

      // 先查找一下是否有这一项
      const index = this.historyList.indexOf(searchText);
      // 如果有的话先把这一项删除
      if (index !== -1) {
        this.historyList.splice(index, 1);
      }
      this.historyList.unshift(this.searchText);

      // 如果未登录就往本地存储放
      setItem("search-history", this.historyList);
    },
    // 取消按钮
    onCancel() {
      this.$emit("closePopup");
      // this.$refs.history.isDeleteIconShow = true;
    },
    //删除内容
    onClear() {
      this.isResultShow = false;
    },

    // 关闭弹出层时候对搜索页面重置化
    sonResetSousuo() {
      this.isResultShow = false;
      this.searchText = null;
    },

    // 页面加载初始化，加载请求历史记录
    async loadSerachHistory() {
      const localHistory = getItem("search-history") || [];

      // 接口有问题，没法实现线上数据持久化
      // if (this.user) {
      //   const { data } = await searchHistory();
      //   const historyList = new Set([...localHistory, ...data.data.keywords]);
      //   this.historyList = [...historyList];
      // } else {
      // }
      this.historyList = localHistory;
    }
  },
  computed: {
    ...mapState(["user"])
  }
};
</script>

<style lang="less" scoped>
.channel-edit {
  .placeholder {
    width: 100%;
    height: 20px;
    background-color: #2892ff;
    border-radius: 15px 15px 0 0;
  }
  .search-button {
    margin-top: -10px;
  }
  /deep/.right-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 33.98px;
  }
}
</style>
