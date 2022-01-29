<template>
  <div>
    <div class="container02">
      <van-radio-group
        v-model="radio"
        direction="horizontal"
      >
        <van-radio
          :name="1"
          shape="square"
          checked-color="#ee0a24"
        >
          男性
        </van-radio>
        <van-radio
          :name="0"
          shape="square"
          checked-color="#ee0a24"
        >
          女性
        </van-radio>
      </van-radio-group>
      <van-button
        round
        block
        type="info"
        @click="updateSex"
      >
        提交
      </van-button>
    </div>
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateSex',
  props: {
    sex: {
      // type: Number,
      required: true
    }
  },
  data () {
    return {
      radio: 1
    }
  },
  methods: {
    async updateSex () {
      if (this.radio === this.sex) {
        this.$toast('性别未变！')
      } else {
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: '性别更改中...'
        })

        const { data } = await updateUserProfile({
          gender: this.radio
        })

        if (data.message === 'OK') {
          this.$toast.success({
            message: '性别更改成功'
          })
          this.$emit('closePopup', this.radio)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container02 {
  width: 300px;
  height: 160px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  margin: 0 auto;
  margin-top: 40px;
  padding: 0 10px 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
