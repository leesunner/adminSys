<template>
  <el-dialog :title="'反馈详情'" :visible.sync="$attrs.show" @close="close" width="685px">
    <el-form label-width="140px"
             size="mini"
             class="form"
             ref="formRules"
             :model="formData">
      <el-form-item label="联系方式">
        <el-input
          disabled
          :placeholder="``"
          clearable
          v-model="formData.contactWay">
        </el-input>
      </el-form-item>
      <el-form-item label="反馈内容">
        <el-input
          disabled
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          :placeholder="`反馈内容`"
          clearable
          v-model="formData.content">
        </el-input>
      </el-form-item>
      <el-form-item label="反馈时间">
        <el-date-picker
          clearable
          disabled
          v-model="formData.createTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="反馈图片">
        <el-image
          style="width: 100px; height: 100px"
          :src="imgUrl"
          :preview-src-list="formData.images">
        </el-image>
        <el-row style="padding-left: 12px;font-size: 12px;color: #E4E7ED;">
          * 点击可查看大图
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {formatTime} from '../../filters/filters'
  export default {
    props: ['taskId'],
    name: "feed-back-index",
    data() {
      return {
        formData: {
          content: "",
          contactWay: "",
          createTime: '',
          images: null,
        },
        imgUrl: '',
      }
    },
    watch: {
      '$attrs.show'(newVal) {
        if (newVal) {
          this.getFormData()
        }
      },
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      //获取表信息
      getFormData() {
        this.$request.get(`${this.$apiList.feedBack}/${this.taskId}`).then(res => {
          this.formData = res.data.data
          this.formData.createTime = formatTime(this.formData.createTime)
          this.imgUrl =this.formData.images.length>0?this.formData.images[0]:''
        })
      },
      //浏览大图
      handlePictureCardPreview(file) {
        this.imgUrl = file.url
        this.dialogVisible = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .form {
    & /deep/ .el-input__inner {
      width: 505px;
    }
  }

</style>
