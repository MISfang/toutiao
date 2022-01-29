<template>
  <div class="search-suggestion">
    <!-- 最上面的那个说明 -->
    <!-- 最上面的历史记录和删除按钮 -->
    <van-cell
      title="搜索建议"
      class="top-cell"
    />

    <van-cell-group class="cellGroup">
      <van-cell
        v-for="(str, index) in suggestList"
        :key="index"
        icon="search"
        @click="$emit('suggestion', str)"
      >
        <div
          slot="title"
          v-html="highlight(str)"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { searchSuggest } from '@/api/search'
import { Toast } from 'vant'

// 用lodash的第三方包来实现函数的防抖和节流
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestList: []
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      handler: debounce(async function () {
        // 输入框一变化就发请求
        const { data } = await searchSuggest(this.searchText)
        const { options } = data.data
        if (options.length === 0) {
          Toast.fail('没有相关\n搜索建议')
        }
        this.suggestList = options
      }, 300),
      immediate: true
    }
  },
  methods: {
    highlight (str) {
      const ZZ = new RegExp(this.searchText, 'gi')
      const res = str.replace(
        ZZ,
        `<span style="color:red;font-weight:700;font-size:15px">${this.searchText}</span>`
      )
      return res
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/.cellGroup {
    .van-cell {
      background-color: #f7f8fa;
      border: 1px solid #9ebfe0;
      border-radius: 12px;
      margin: 4px 0;
      box-shadow: 4px 10px 12px 2px #ebedf0;
    }
    margin: 10px 10px 0 10px;
  }
}
.top-cell {
  /deep/.van-cell__title {
    font-size: 18px;
    color: #2892ff;
    display: flex;
    align-items: center;
  }
}
</style>
