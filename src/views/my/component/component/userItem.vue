<template>
  <div class="itemcontainer">
    <div class="topcontainer">
      <van-image
        class="image"
        width="80"
        height="80"
        :src="itemData.photo"
        round
      />
      <van-checkbox v-model="itemData.mutual_follow">
        是否互粉
      </van-checkbox>
    </div>
    <van-cell-group>
      <van-cell
        title="用户名"
        :value="itemData.name"
      />
      <van-cell
        title="粉丝总数"
        :value="itemData.fans_count"
      />
    </van-cell-group>
  </div>
</template>
<script>
export default {
  name: 'UserItem',
  props: {
    itemData: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="less" scoped>
.image {
  border: 4px solid #3e9cfa;
}
.itemcontainer {
  width: 180px;
  height: 180px;
  box-shadow: 0 8px 12px #e4e4e4;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/deep/.van-cell {
  width: 160px;
  font-size: 16px;
  height: 40px;
}
.topcontainer {
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/.van-checkbox {
  margin-left: 5px;
  width: 60px;
  .van-checkbox__label {
    font-size: 14px;
  }
}
</style>
