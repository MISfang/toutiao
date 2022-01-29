<template>
  <div class="container02">
    <van-form @submit="onSubmit">
      <van-cell
        title="原昵称"
        :value="name"
      />
      <van-field
        v-model="newName"
        name="新昵称"
        label="新昵称"
        placeholder="新的昵称"
        maxlength="7"
        :rules="[
          { required: true, message: '请填写新的昵称' },
          { validator, message: '昵称最少有3个字最多有7个字' }
        ]"
      />
      <div style="margin: 16px;">
        <van-button
          round
          block
          type="info"
          native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    name: {
      // type: String,
      required: true
    }
  },
  data () {
    return {
      newName: ''
    }
  },
  methods: {
    async onSubmit ({ 新昵称 }) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '昵称更改中...'
      })
      try {
        const { data } = await updateUserProfile({
          name: 新昵称
        })

        if (data.message === 'OK') {
          this.$toast.success({
            message: '昵称更改成功'
          })
          this.$emit('closePopup', 新昵称)
          this.newName = ''
        }
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('改用户名已存在，请换一个！')
          this.newName = ''
        }
      }
    },

    // 表单校验的
    validator (val) {
      return val.length >= 3 && val.length <= 7
    }
  }
}
</script>
<style lang="less" scoped>
.container02 {
  margin-top: 40px;
}
</style>
