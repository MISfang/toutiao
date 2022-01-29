<template>
  <div>
    <div class="container">
      <van-nav-bar
        class="app-nav-bar"
        title="个人信息"
        left-arrow
        @click-left="$router.back()"
      />
      <van-cell-group>
        <van-cell
          class="first-cell"
          title="信息名"
          label="左滑点击可以修改"
          center
          value="具体内容"
        />
        <van-swipe-cell>
          <van-cell
            title="头像"
            center
          >
            <van-image
              round
              width="100"
              height="100"
              fit="cover"
              :src="message.photo"
              @click="openImg"
            />
          </van-cell>
          <template #right>
            <van-button
              square
              type="info"
              text="修改"
              @click="showAvatar = true"
            />
          </template>
        </van-swipe-cell>
        <van-swipe-cell>
          <van-cell
            title="昵称"
            center
            :value="message.name"
          />
          <template #right>
            <van-button
              square
              type="info"
              text="修改"
              @click="showNickName = true"
            />
          </template>
        </van-swipe-cell>

        <van-swipe-cell>
          <van-cell
            title="性别"
            center
            :value="message.gender === 1 ? '男' : '女'"
          />
          <template #right>
            <van-button
              square
              type="info"
              text="修改"
              @click="showSex = true"
            />
          </template>
        </van-swipe-cell>

        <van-swipe-cell>
          <van-cell
            title="生日"
            center
            :value="message.birthday"
          />
          <template #right>
            <van-button
              square
              type="info"
              text="修改"
              @click="showBirthday = true"
            />
          </template>
        </van-swipe-cell>
        <van-cell
          title="手机号"
          label="不可修改"
          center
          :value="message.mobile"
        />
      </van-cell-group>
    </div>

    <!-- 下面的四条属性的四个弹出层 -->
    <van-popup
      v-model="showAvatar"
      round
      closeable
      close-icon="close"
      position="top"
      :style="{ height: '60%' }"
    >
      <updateAvatar
        :url="message.photo"
        @update-photo="closePopupAvator"
      />
    </van-popup>
    <van-popup
      v-model="showNickName"
      round
      closeable
      close-icon="close"
      position="top"
      :style="{ height: '31%' }"
    >
      <updateName
        :name="message.name"
        @closePopup="closePopupName"
      />
    </van-popup>
    <van-popup
      v-model="showSex"
      round
      closeable
      close-icon="close"
      position="top"
      :style="{ height: '35%' }"
    >
      <updateSex
        :sex="message.gender"
        @closePopup="closePopupSex"
      />
    </van-popup>

    <!-- 生日更改 -->
    <van-calendar
      v-model="showBirthday"
      position="top"
      @confirm="updateNewBirthday"
      :min-date="minDate"
      :max-date="maxDate"
      :show-confirm="false"
      color="#2892ff"
    />
  </div>
</template>
<script>
import { getUserProfile, updateUserProfile } from '@/api/user'
import updateName from '@/views/user-profile/component/updateName'
import updateAvatar from '@/views/user-profile/component/updateAvatar'
import updateSex from '@/views/user-profile/component/updateSex'

import { ImagePreview } from 'vant'

export default {
  name: 'UserProfile',
  components: {
    updateName,
    updateAvatar,
    updateSex
  },
  data () {
    return {
      message: {},
      showAvatar: false,
      showNickName: false,
      showSex: false,
      showBirthday: false,
      minDate: new Date(2021, 0, 1),
      maxDate: new Date(2021, 11, 31)
    }
  },
  async mounted () {
    const { data } = await getUserProfile()
    this.message = data.data
  },
  methods: {
    closePopupName (newName) {
      this.showNickName = false
      this.message.name = newName
    },
    closePopupSex (newSex) {
      this.showSex = false
      this.message.gender = newSex
    },

    closePopupAvator (newAvatar) {
      this.message.photo = newAvatar
      this.showAvatar = false
    },

    openImg () {
      ImagePreview({
        images: [this.message.photo],
        closeable: true
      })
    },

    async updateNewBirthday (date) {
      const newBirthday = `2021-${date.getMonth() + 1}-${date.getDate()}`

      const { data } = await updateUserProfile({
        birthday: newBirthday
      })
      this.$toast.loading('正在修改生日')
      if (data.message === 'OK') {
        this.$toast.success('修改成功')
        this.showBirthday = false
        this.message.birthday = newBirthday
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 667px;
  background: linear-gradient(to right, #0052d4, #4364f7, #6fb1fc);
  /deep/.van-cell-group {
    width: 95%;
    margin: 40px auto 0;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.8);
  }
  /deep/.van-image {
    border: 8px solid rgba(37, 92, 231, 0.4);
  }
  /deep/.van-cell__label {
    color: red;
  }
  /deep/ .van-swipe-cell__right {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .first-cell {
    background-color: #2892ff;
    color: white;
    font-size: 20px;
    border-bottom: 1px solid black;
    /deep/.van-cell__value {
      color: white;
    }
  }
}

/deep/.van-popup__close-icon {
  font-size: 32px;
  margin-top: -14px;
  color: black;
  font-weight: 700;
  position: absolute;
  top: 20px;
}
</style>
