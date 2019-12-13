<template>
  <el-dialog :title="itemId?'编辑站点':'创建站点'" :visible.sync="$attrs.show" @close="close">
    <el-form label-width="100px"
             size="mini"
             :rules="rules"
             ref="formRules"
             :model="columnData">
      <el-form-item label="站点名称" prop="name">
        <el-input
          placeholder="输入站点名称"
          clearable
          v-model="columnData.name">
        </el-input>
      </el-form-item>
      <el-form-item label="站点标题" prop="title">
        <el-input
          placeholder="输入站点标题"
          clearable
          v-model="columnData.title">
        </el-input>
      </el-form-item>
      <el-form-item label="站点连接" prop="domain">
        <el-input
          placeholder="输入站点连接"
          clearable
          v-model="columnData.domain">
        </el-input>
      </el-form-item>
      <el-form-item label="版权著作">
        <el-input
          placeholder="输入内容"
          clearable
          v-model="columnData.copyright">
        </el-input>
      </el-form-item>
      <el-form-item label="站点描述">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder="输入站点描述"
          clearable
          v-model="columnData.description">
        </el-input>
      </el-form-item>
      <!--编辑弹框-->
      <el-form-item label="站点LOGO" prop="logo" v-if="itemId">
        <el-upload
          :action="$baseUrl+$apiList.fileUpload"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
          list-type="picture-card"
          :file-list="[editData]"
          :limit="1"
          :auto-upload="true">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;">
          * 上传LOGO限制一张
        </el-row>
      </el-form-item>
      <!--创建弹框-->
      <el-form-item label="站点LOGO" prop="logo" v-else>
        <el-upload
          :action="process.env.BASE_URL+$apiList.fileUpload"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
          list-type="picture-card"
          :limit="1"
          :auto-upload="true">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;">
          * 上传LOGO限制一张
        </el-row>
      </el-form-item>
      <el-form-item label="站点开关">
        <el-tooltip :content="columnData.hideStatus?'隐藏后看不到栏目':'现在可以看到栏目了'" placement="right">
          <el-switch
            v-model="columnData.hideStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="false"
            :inactive-value="true">
          </el-switch>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="columnData.logo" alt="">
    </el-dialog>
    <div slot="footer">
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button size="mini" @click="edit" type="primary" v-if="itemId">保存</el-button>
      <el-button size="mini" @click="create" type="primary" v-else>创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "create-website",
    props: ['itemId'],
    data() {
      return {
        columnData: {
          description: "",
          copyright: '',
          domain: "",
          keywords: "",
          logo: "",
          name: "",
          remarks: "",
          title: "",
          hideStatus: true, //隐藏
        },
        editData:{},
        dialogVisible: false,
        rules: {
          name: [{required: true, message: '请输入站点名', trigger: 'blur'}],
          domain: [{required: true, message: '请输入站点连接', trigger: 'blur'}],
          title: [{required: true, message: '请输入站点标题', trigger: 'blur'}],
          logo: [{required: true, message: '请上传站点LOGO', trigger: 'blur'}],
        }
      }
    },
    watch: {
      itemId(newVal) {
        if (newVal) {
          this.getWesiteInfo()
        }else{
          this.columnData = {
            description: "",
              copyright: '',
              domain: "",
              keywords: "",
              logo: "",
              name: "",
              remarks: "",
              title: "",
              hideStatus: true, //隐藏
          }
        }
      }
    },
    methods: {
      close() {
        this.$emit('close', false)
      },
      //创建
      create() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            this.$request.post(this.$apiList.website, this.columnData).then(res => {
              this.$message.success(res.data.msg)
              this.close()
            })
          }
        })
      },
      //编辑
      edit() {
        this.$request.put(this.$apiList.website, this.columnData).then(res => {
          this.$message.success(res.data.msg)
          this.close()
        })
      },
      //获取信息
      getWesiteInfo() {
        this.$request.get(`${this.$apiList.website}/${this.itemId}`).then(res => {
          this.editData = res.data.data
          this.editData.url = res.data.data.logo
          this.columnData = res.data.data
          this.columnData.url = res.data.data.logo
        })
      },
      //上传成功回调
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.columnData.logo = res.data
          this.editData.logo = res.data
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
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //删除图片
      handleRemove(file) {
        this.columnData.url = ''
        this.editData.url = ''
      },
      //浏览大图
      handlePictureCardPreview(file) {
        this.dialogVisible = true;
      },
      // handleDownload(file) {
      //   console.log(file);
      // }
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
</style>

