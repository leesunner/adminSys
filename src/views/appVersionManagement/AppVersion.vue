<template>
  <div>
    <el-form label-width="100px"
             size="mini"
             inline
             class="website"
             ref="formRules"
             :model="createInfo">
      <el-row class="rowCon">
        <el-form-item label="APP二维码">
          <!--编辑弹框-->
          <!--<el-upload-->
            <!--:action="$baseUrl+$apiList.fileUpload"-->
            <!--:data="{businessFileType:6}"-->
            <!--:on-success="handleAvatarSuccess"-->
            <!--:on-error="handleAvatarError"-->
            <!--:before-upload="beforeAvatarUpload"-->
            <!--:on-remove="handleRemove"-->
            <!--:on-preview="handlePictureCardPreview"-->
            <!--list-type="picture-card"-->
            <!--:file-list="[detailInfo]"-->
            <!--:headers="headers"-->
            <!--:limit="1"-->
            <!--:auto-upload="true">-->
            <!--<i class="el-icon-plus"></i>-->
          <!--</el-upload>-->
          <!--创建弹框-->
          <el-upload
            :action="$baseUrl+$apiList.fileUpload"
            :data="{businessFileType:8}"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            list-type="picture-card"
            :limit="1"
            :headers="headers"
            ref="uploadImage"
            :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;">
            * 上传二维码限制一张
          </el-row>
        </el-form-item>
      </el-row>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="createInfo.imageUrl" alt="">
    </el-dialog>
    <el-row style="text-align: right;width: 430px;">
      <el-button type="primary" size="small" @click.stop="submitImage">上传二维码</el-button>
    </el-row>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    components: {ElRow},
    name: "app-version",
    data() {
      return {
        createInfo: {
          imageUrl: "",
        },
        headers: {
          'Authorization': `Bearer ${this._session.getSessoin('AUTH_TOKEN')}`
        },
        detailInfo:{},
        dialogVisible:false,
      }
    },
    methods: {
      //上传成功回调
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.createInfo.imageUrl = res.data
          this.detailInfo.imageUrl = res.data
          this.detailInfo.imageUrl = res.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(res.msg)
        }
      },
      //上传出错回调
      handleAvatarError(err) {
        this.$message.error('上传发生错误')
      },
      submitImage(){
        this.$confirm('请确认上传最新的二维').then(res=>{
          if (res == 'confirm'){
            this.$refs.uploadImage.submit()
          }
        })
      },
      //上传拦截
      beforeAvatarUpload(file) {
          if (!(file.type=='image/png'||file.type=='image/jpeg')){
            this.$message.error('上传文件类型错误');
            return false
          }
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
          }
          return isLt2M
      },
      //删除图片
      handleRemove(file) {
        this.createInfo.url = ''
        this.detailInfo.url = ''
      },
      //浏览大图
      handlePictureCardPreview(file) {
        this.dialogVisible = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-upload-img{
    width: 146px;
    height: 146px;
    display: block;
    margin-top: 20px;
  }
  .website{
    & /deep/ .el-textarea__inner{
      width: 500px;
    }
  }
  .rowCon{
    & /deep/ .el-form-item__content{
      width: auto;
    }
  }
</style>

