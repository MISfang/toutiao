<template>
  <div class="container02">
    <van-image
      width="200"
      height="200"
      :src="url"
      fit="cover"
      round
      class="myimg"
      @click="clickAvator"
    />
    <h4 class="title">原头像<small>（点击可预览）</small></h4>

    <van-uploader :after-read="afterRead" accept="image/*">
      <van-button icon="user-circle-o" type="info" round>更改头像</van-button>
    </van-uploader>

    <!-- 上传图片的弹出框 -->
    <van-dialog
      v-model="isDialogShow"
      title="图片裁切"
      show-cancel-button
      theme="round-button"
      @confirm="upLoadAvator"
    >
      <div class="cropperBox">
        <vueCropper
          :img="srcObject.content"
          :outputSize="1"
          outputType="png"
          :autoCrop="true"
          :fixedBox="true"
        ></vueCropper>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
import { VueCropper } from "vue-cropper";
import { updateUserPhoto } from "@/api/user";
export default {
  name: "updateAvatar",
  props: {
    url: {
      type: String,
      required: true
    }
  },
  components: {
    VueCropper
  },
  data() {
    return {
      isDialogShow: false,
      srcObject: {}
    };
  },

  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      this.srcObject = file;

      // 打开对应的弹出层
      this.isDialogShow = true;
    },

    async upLoadAvator() {
      const fd = new FormData();
      fd.append("photo", this.srcObject);

      const { data } = await updateUserPhoto(fd);
      this.$toast.loading("正在上传");

      if (data.message === "OK") {
        this.$toast.success("上传成功");
      }
      this.$emit("update-photo", this.srcObject.content);
    },

    clickAvator() {
      ImagePreview({
        images: [this.url],
        closeable: true
      });
    }
  }
};
</script>
<style lang="less" scoped>
.container02 {
  background: linear-gradient(to right, #0052d4, #4364f7, #6fb1fc);
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .myimg {
    border: 10px solid rgba(53, 154, 255, 0.8);
    margin-bottom: -10px;
    margin-top: 20px;
  }
  .title {
    font-weight: 400;
    margin-bottom: 20px;
  }
  .cropperBox {
    width: 300px;
    height: 300px;
    margin: 0 auto 20px;
    border: 10px solid rgba(53, 154, 255, 0.8);
  }
}
</style>
