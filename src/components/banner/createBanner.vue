<template>
  <el-dialog :title="itemId?'编辑banner':'创建banner'" width="712px" :visible.sync="$attrs.show" @close="close" class="banner">
    <el-form label-width="136px"
             size="mini"
             :rules="rules"
             ref="formRules"
             :model="columnData">
      <el-form-item label="banner标题" prop="title">
        <el-input
          placeholder="输入轮播标题"
          clearable
          :disabled="checkType"
          v-model="columnData.title">
        </el-input>
      </el-form-item>
      <el-form-item label="banner内容链接">
        <el-input
          placeholder="输入banner链接地址"
          clearable
          :disabled="checkType"
          v-model="columnData.contentUrl">
        </el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          :disabled="checkType"
          v-model="columnData.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          :disabled="checkType"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="columnData.endTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="banner内容">
        <el-input
          type="textarea"
          :disabled="checkType"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder="输入banner内容"
          clearable
          v-model="columnData.bannerContent">
        </el-input>
      </el-form-item>
      <el-form-item label="banner展示端" required>
        <el-radio v-model="columnData.showType" :disabled="checkType" v-for="(item,index) in showTypeRadio"
                  :label="item" :key="index+10">{{item}}
        </el-radio>
      </el-form-item>
      <!--编辑弹框-->
      <!--app图片-->
      <el-row v-if="itemId">
        <el-form-item label="上传图片" required>
          <el-upload
            :action="$baseUrl+$apiList.fileUpload"
            :data="{businessFileType:4}"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            list-type="picture"
            :disabled="checkType"
            :file-list="editData.url?[editData]:[]"
            :headers="headers"
            :limit="1"
            :auto-upload="true">
            <el-button size="mini" type="primary" v-if="!columnData.imgUrl">点击上传</el-button>
          </el-upload>
          <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;">
            * 上传banner限制一张
          </el-row>
        </el-form-item>
      </el-row>
      <!--创建弹框-->
      <el-row v-else>
        <el-form-item label="上传图片" required>
          <el-upload
            :action="$baseUrl+$apiList.fileUpload"
            :data="{businessFileType:4}"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            list-type="picture"
            :limit="1"
            :disabled="checkType"
            :headers="headers"
            :auto-upload="true">
            <el-button size="mini" type="primary" v-if="!columnData.imgUrl">点击上传</el-button>
          </el-upload>
          <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;">
            * 上传banner限制一张
          </el-row>
        </el-form-item>
      </el-row>
      <el-form-item label="是否开启">
        <el-tooltip :content="columnData.enable?'现在可以看到banner':'现在隐藏banner'" placement="right">
          <el-switch
            :disabled="checkType"
            v-model="columnData.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
    <div slot="footer">
      <el-button
        size="mini"
        @click="checkType = false"
        v-if="itemId&&buttonControl[_config.buttonCode.B_UPDATE]"
      >启用编辑
      </el-button>
      <el-button size="mini" v-if="!checkType&&itemId" @click="checkType = true">关闭编辑</el-button>
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button size="mini" @click="edit" type="primary"
                 v-if="itemId&&buttonControl[_config.buttonCode.B_UPDATE]">保存
      </el-button>
      <el-button size="mini" @click="create" type="primary"
                 v-if="!itemId&&buttonControl[_config.buttonCode.B_CREATE]">创建
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {formatTime} from '@/filters/filters'

  export default {
    name: "create-banner",
    props: ['itemId','buttonControl','showTypeRadio'],
    data() {
      return {
        checkType: true,
        columnData: {
          bannerContent: "",
          contentUrl: "",
          endTime: "",
          startTime: "",
          showType: 'APP',
          enable: true,
          title: "",
          imgUrl: ""
        },
        imgUrl: '',
        headers: {
          'Authorization': `Bearer ${this._session.getSessoin('AUTH_TOKEN')}`
        },
        editData: {},
        dialogVisible: false,
        rules: {
          title: [{required: true, message: '请输入banner标题', trigger: 'blur'}],
        }
      }
    },
    watch: {
      '$attrs.show'(newVal) {
        if (newVal) {
          if (this.itemId) {
            this.getWesiteInfo()
            this.checkType = true
          } else {
            this.checkType = false
          }
        } else {
          this.columnData = {
            bannerContent: "",
            contentUrl: "",
            endTime: "",
            startTime: "",
            showType: 'APP',
            state: 1,
            title: "",
            imgUrl: ""
          }
        }
      },
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      checkInfo() {
        let st = this.columnData.startTime, et = this.columnData.endTime;
        let control = true
        if (st || et) {
          switch (true) {
            case st && !et:
              this.$message.error('请选择结束时间')
              control = false
              break;
            case et && !st:
              this.$message.error('请选择开始时间')
              control = false
              break;
            case st && et && st >= et:
              this.$message.error('开始时间不能早于结束时间')
              control = false
              break;
            case st && et:
              this.columnData.startTime = formatTime(st)
              this.columnData.endTime = formatTime(et)
              break;
          }
        }
        if (!this.columnData.imgUrl&&control) {
          this.$message.error('请先上传图片')
          control = false
        }
        return control
      },
      //创建
      create() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            if (this.checkInfo()) {
              this.$request.post(this.$apiList.banner, this.columnData).then(res => {
                this.$message.success(res.data.msg)
                this.close()
                this.$emit('fresh',true)
              })
            }
          }
        })
      },
      //编辑
      edit() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            if (this.checkInfo()) {
              this.$request.put(this.$apiList.banner, this.columnData).then(res => {
                this.$message.success(res.data.msg)
                this.close()
                this.$emit('fresh',true)
              })
            }
          }
        })
      },
      //获取信息
      getWesiteInfo() {
        this.$request.get(`${this.$apiList.banner}/${this.itemId}`).then(res => {
          this.columnData = res.data.data
          this.editData = {
            url: this.columnData.imgUrl
          }
          this.columnData.startTime = formatTime(this.columnData.startTime)
          this.columnData.endTime = formatTime(this.columnData.endTime)
        })
      },
      //上传成功回调
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.columnData.imgUrl = res.data
          this.editData.url = res.data
        } else {
          this.$message.error(res.msg)
        }
      },

      //上传出错回调
      handleAvatarError(err) {
        this.$message.error('上传发生错误')
      },
      //上传拦截
      beforeAvatarUpload(file) {
        if (!(file.type == 'image/png' || file.type == 'image/jpeg')) {
          this.$message.error('上传文件类型错误');
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //app删除图片
      handleRemove(file) {
        this.columnData.imgUrl = ''
        this.editData = {}
      },
      //浏览大图
      handlePictureCardPreview(file) {
        this.dialogVisible = true;
        this.imgUrl = file.url
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-upload-img {
    width: 146px;
    height: 146px;
    display: block;
    margin-top: 20px;
  }

  .el-date-editor--datetime {
    width: 536px;
  }
  .banner{
    & /deep/.el-upload-list__item-thumbnail{
      width: 165px;
    }
  }

</style>

