<template>
  <el-dialog :title="itemId?'编辑文章':'创建文章'" fullscreen :visible.sync="$attrs.show" @close="close">
    <el-row class="content">
      <el-form label-width="115px"
               size="mini"
               inline
               :rules="rules"
               ref="formRules"
               :model="columnData">
        <el-tabs v-model="tabActiveName">
          <el-tab-pane label="文章基本配置" name="first">
            <el-col>
              <el-form-item label="文章标题" prop="title">
                <el-input
                  placeholder="文章标题"
                  clearable
                  v-model="columnData.title">
                </el-input>
              </el-form-item>
              <el-form-item label="所属站点" prop="siteId" v-if="!itemId">
                <el-select
                  v-model="columnData.siteId"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入所属站点关键字"
                  :remote-method="remoteMethod"
                  :loading="loading">
                  <el-option
                    v-for="item in webOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属栏目" prop="categoryId">
                <el-cascader
                  v-model="columnData.categoryId"
                  :options="$attrs.columnOptions"
                  :props="{
            value:'id',
            label:'name',
            emitPath: false,
            checkStrictly: true}"
                  clearable></el-cascader>
              </el-form-item>
              <el-form-item label="文章作者">
                <el-input
                  clearable
                  placeholder="请输入文章作者"
                  v-model="columnData.author">
                </el-input>
              </el-form-item>
              <el-form-item label="文章来源">
                <el-input
                  clearable
                  placeholder="请输入文章来源"
                  v-model="columnData.copyFrom">
                </el-input>
              </el-form-item>
              <el-form-item label="搜索关键字">
                <el-input
                  clearable
                  placeholder="请输入关键字"
                  v-model="columnData.keywords">
                </el-input>
              </el-form-item>
              <el-row>
                <el-form-item label="专题分类" prop="type">
                  <el-radio-group v-model="columnData.type">
                    <el-radio :label="item.key" v-for="item in _config.dict_wordType" :key="item.key">{{item.value}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否显示" style="margin-left: 50px;">
                  <el-tooltip :content="columnData.hideStatus?'隐藏':'显示'" placement="right">
                    <el-switch
                      v-model="columnData.hideStatus"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="false"
                      :inactive-value="true">
                    </el-switch>
                  </el-tooltip>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="文章封面图" prop="image" >
                  <!--编辑图片-->
                  <el-upload
                    v-if="itemId"
                    :action="$baseUrl+$apiList.fileUpload"
                    :data="{businessFileType:2}"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :on-preview="handlePictureCardPreview"
                    list-type="picture-card"
                    :file-list="[editData]"
                    :headers="headers"
                    :limit="1"
                    :auto-upload="true">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <!--创建图片-->
                  <el-upload
                    v-else
                    :action="$baseUrl+$apiList.fileUpload"
                    :data="{businessFileType:2}"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :on-preview="handlePictureCardPreview"
                    list-type="picture-card"
                    :limit="1"
                    :headers="headers"
                    :auto-upload="true">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-row style="padding-left: 12px;font-size: 12px;color: #f56c6c;">
                    * 上传限制一张
                  </el-row>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="文章摘要" prop="description">
                  <el-input
                    type="textarea"
                    clearable
                    :autosize="{ minRows: 5, maxRows: 10}"
                    placeholder="请输入文章摘要"
                    v-model="columnData.description">
                  </el-input>
                </el-form-item>
              </el-row>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="文章内容" name="second">
            <el-form-item label="文章内容" prop="content">
              <ueditor @change="val => columnData.content = val " ref="ueditor"></ueditor>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="columnData.image" alt="">
      </el-dialog>
    </el-row>
    <div slot="footer" style="text-align: center;">
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button size="mini" @click="edit" type="primary" v-if="itemId&&$attrs.buttonControl[_config.buttonCode.B_UPDATE]">保存</el-button>
      <el-button size="mini" @click="create" type="primary" v-if="!itemId&&$attrs.buttonControl[_config.buttonCode.B_CREATE]">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Ueditor from '@/components/ueditor/Ueditor'
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    name: "create-word",
    components: {
      ElRow,
      Ueditor},
    props: ['itemId'],
    data() {
      return {
        dialogVisible:false,
        headers: {
          'Authorization': `Bearer ${this._session.getSessoin('AUTH_TOKEN')}`
        },
        tabActiveName: 'first',
        //站点查询
        searchData: {
          pageSize: this._config.sizeArr[0],
          pageNum: 1,
          keywords: '',//站点关键字搜索
          name: '',
          domain: '',
        },
        //提交数据
        columnData: {
          title: "",
          content: '',
          siteId: '',
          description: '',
          categoryId: '',
          author: '',
          type: '',// 1、国内新闻 2、县级新闻 3、通知公告
          copyFrom: '',
          keywords: '',
          hideStatus: false, //默认显示发布
          image:'',
        },
        //搜索获取数据
        webOptions: [],//搜索的站点
        editData: {},
        loading: false,
        rules: {
          content: [{required: true, message: '请输入文章内容', trigger: 'blur'}],
          title: [{required: true, message: '请输入文章标题', trigger: 'blur'}],
          siteId: [{required: this.itemId ? false : true, message: '请选择站点', trigger: 'blur'}],
          categoryId: [{required: true, message: '请选择栏目', trigger: 'blur'}],
          type: [{required: true, message: '请选择文章分类', trigger: 'change'}],
          image:[{required: true, message: '文章封面图不能为空', trigger: 'blur'}]
        }
      }
    },
    watch: {
      '$attrs.show'(newVal) {
        if (newVal) {
          this.getArticelInfo()
          this.getSites()
        } else {
          this.columnData = {
            title: "",
            content: '',
            siteId: '',
            description: '',
            categoryId: '',
            author: '',
            type: '',// 1、国内新闻 2、县级新闻 3、通知公告
            copyFrom: '',
            keywords: '',
            hideStatus: false, //默认显示发布
          }
          this.$refs.ueditor.msg = '您可以点击右上角的屏幕小标全屏编辑内容'
        }
      },
    },
    methods: {
      close(val) {
        this.$emit('close', val)
      },
      //获取文章详情
      getArticelInfo() {
        this.$request.get(`${this.$apiList.article}/${this.itemId}`).then(res => {
          this.columnData = res.data.data
          this.editData.url = res.data.data.image
          this.$refs.ueditor.msg = res.data.data.content
        })
      },
      //创建
      create() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            if (this.columnData.content.length>200){
              this.$request.post(this.$apiList.article, this.columnData).then(res => {
                this.$message.success(res.data.msg)
                this.close(1)
              })
            }else{
              this.$message.success('文章内容不够200字')
            }
          }
        })
      },
      //编辑
      edit() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            if (this.columnData.content.length>200) {
              this.$request.put(this.$apiList.article, this.columnData).then(res => {
                this.$message.success(res.data.msg)
                this.close(1)
              })
            }else{
              this.$message.success('文章内容不够200字')
            }
          }
        })
      },
      //搜索获取站点
      remoteMethod() {
        if (!this.loading) {
          this.loading = true
          this.getSites()
        } else {
          this.$message.warning('正在查询中...')
        }
      },
      getSites(){
        this.$request.get(`${this.$apiList.website}`, {
          params: this.searchData
        }).then(res => {
          this.loading = false
          this.webOptions = res.data.data.list
        })
      },
      //选择标记
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      //上传成功回调
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.columnData.image = res.data
          this.editData.image = res.data
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
        if (!(file.type=='image/png'||file.type=='image/jpeg')){
          this.$message.error('上传文件类型错误');
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      //删除图片
      handleRemove(file) {
        this.columnData.image = ''
        this.editData.image = ''
        this.editData.url = ''
      },
      //浏览大图
      handlePictureCardPreview(file) {
        this.dialogVisible = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    & /deep/ .el-input__inner {
      width: 350px;
    }
    & .el-textarea {
      width: 350px;
    }
  }

</style>


