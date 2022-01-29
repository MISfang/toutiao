<template>
  <div class="search-suggestion">
    <div
      class="noHistory"
      v-if="historyList.length === 0"
    >
      暂无搜索记录
    </div>
    <div
      class="haveHistory"
      v-else
    >
      <!-- 最上面的历史记录和删除按钮 -->
      <van-cell
        title="历史记录"
        class="top-cell"
      >
        <template
          #right-icon
          v-if="isDeleteIconShow"
        >
          <van-icon
            name="delete-o"
            class="search-icon"
            @click="isDeleteIconShow = false"
          />
        </template>
        <!-- 那个删除按钮和那个两个按钮的元素 -->
        <template
          #right-icon
          v-else
        >
          <van-button
            round
            type="warning"
            size="small"
            class="two-button left"
            @click="deleteAll"
          >
            全部删除
          </van-button>
          <van-button
            class="two-button"
            round
            type="primary"
            size="small"
            @click="isDeleteIconShow = true"
          >
            完成
          </van-button>
        </template>
      </van-cell>
      <!-- 结束 -->

      <van-cell-group class="cellGroup">
        <van-cell
          icon="clock-o"
          v-for="(item, index) in historyList"
          :key="index"
          @click="onclick(item, index)"
        >
          {{ item }}
          <template
            #right-icon
            v-if="!isDeleteIconShow"
          >
            <van-icon name="close" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getItem, setItem } from '@/utils/storeage'
import { Dialog, Toast } from 'vant'

export default {
  name: 'SearchSuggestion',
  data () {
    return {
      // 控制那个删除按钮与两个按钮的切换
      isDeleteIconShow: true
    }
  },
  props: {
    historyList: {
      type: Array,
      require: true
    }
  },
  methods: {
    onclick (item, index) {
      if (!this.isDeleteIconShow) {
        this.historyList.splice(index, 1)
        setItem('search-history', this.historyList)
      } else {
        this.$emit('history', item)
      }
    },
    // 删除全部搜索历史的方法
    deleteAll () {
      Dialog.confirm({
        title: '确定删除全部历史记录',
        message: '删除之后不可恢复！'
      })
        .then(() => {
          // on confirm
          this.$emit('deleteAllHistory', [])
          setItem('search-history', this.historyList)
          Toast.success('成功删除')
        })
        .catch(() => {
          Toast({
            message: '已取消删除',
            icon: 'like'
          })
          // on cancel
        })
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  // 那个删除小图标的样式
  /deep/.van-toast__icon {
    width: 500px !important;
    height: 500px;
  }
  .noHistory {
    font-size: 24px;
    color: #2892ff;
    margin: 20px 0 0 110px;
  }
  .top-cell {
    /deep/.van-cell__title {
      font-size: 18px;
      color: #2892ff;
      display: flex;
      align-items: center;
    }
    .search-icon {
      font-size: 28px;
      line-height: inherit;
      margin-bottom: 6px;
    }
    .two-button {
      width: 80px;
      height: 30px;
      font-size: 12px;
    }
    .left {
      margin-right: 6px;
    }
  }
  .cellGroup {
    .van-cell {
      background-color: #f7f8fa;
      border: 1px solid #9ebfe0;
      border-radius: 12px;
      margin: 2px 0;
      box-shadow: 4px 10px 12px 2px #ebedf0;
      .van-icon-close {
        margin: auto 0;
        font-size: 18px;
        color: #ee0a24;
      }
    }
    margin: 10px 10px 0 10px;
  }
}
</style>
