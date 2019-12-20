<template>
  <el-dialog :title="itemId?'编辑文章':'创建文章'" fullscreen :visible.sync="$attrs.show" @close="close">
    <div class="content">
      <el-form label-width="100px"
               size="mini"
               inline
               :rules="rules"
               ref="formRules"
               :model="columnData">
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
        <el-form-item label="是否显示">
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
        <el-form-item label="专题分类" prop="type">
          <el-radio-group v-model="columnData.type">
            <el-radio :label="item.key" v-for="item in _config.dict_wordType" :key="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-form-item label="文章摘要" prop="description">
            <el-input
              type="textarea"
              clearable
              :autosize="{ minRows: 3, maxRows: 6}"
              placeholder="请输入文章摘要"
              v-model="columnData.description">
            </el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="文章内容" prop="content">
          <ueditor @change="val => columnData.content = val " ref="ueditor"></ueditor>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button size="mini" @click="edit" type="primary" v-if="itemId">保存</el-button>
      <el-button size="mini" @click="create" type="primary" v-else>创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Ueditor from '@/components/ueditor/Ueditor'
  export default {
    name: "create-word",
    components:{Ueditor},
    props: ['itemId'],
    data() {
      return {
        //站点查询
        searchData: {
          pageSize: this._config.sizeArr[0],
          pageNum: 1,
          keywords: '',//站点关键字搜索
          name:'',
          domain:'',
        },
        //提交数据
        columnData: {
          title: "",
          content:'',
          siteId:'',
          description:'',
          categoryId:'',
          author:'',
          type:'',// 1、国内新闻 2、县级新闻 3、通知公告
          copyFrom:'',
          keywords:'',
          hideStatus: false, //默认显示发布
        },
        //搜索获取数据
        webOptions:[],//搜索的站点
        editData:{},
        loading: false,
        rules: {
          content: [{required: true, message: '请输入文章内容', trigger: 'blur'}],
          title: [{required: true, message: '请输入文章标题', trigger: 'blur'}],
          siteId: [{required: this.itemId?false:true, message: '请选择站点', trigger: 'blur'}],
          categoryId: [{required: true, message: '请选择栏目', trigger: 'blur'}],
          type:[{required: true, message: '请选择文章分类', trigger: 'change'}]
        }
      }
    },
    watch: {
      '$attrs.show'(newVal){
        if (newVal) {
          this.getArticelInfo()
        }else{
          this.columnData={
            title: "",
            content:'',
            siteId:'',
            description:'',
            categoryId:'',
            author:'',
            type:'',// 1、国内新闻 2、县级新闻 3、通知公告
            copyFrom:'',
            keywords:'',
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
      getArticelInfo(){
        this.$request.get(`${this.$apiList.article}/${this.itemId}`).then(res => {
          this.columnData = res.data.data
          this.$refs.ueditor.msg = res.data.data.content
        })
      },
      //创建
      create() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            this.$request.post(this.$apiList.article, this.columnData).then(res => {
              this.$message.success(res.data.msg)
              this.close(1)
            })
          }
        })
      },
      //编辑
      edit() {
        this.$request.put(this.$apiList.article, this.columnData).then(res => {
          this.$message.success(res.data.msg)
          this.close(1)
        })
      },
      //搜索获取站点
      remoteMethod(){
        if (!this.loading){
          this.loading = true
          this.$request.get(`${this.$apiList.website}`, {
            params: this.searchData
          }).then(res => {
            this.loading = false
            this.webOptions = res.data.data.list
          })
        }else{
          this.$message.warning('正在查询中...')
        }
      },
      //选择标记
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    & /deep/.el-input__inner{
      width: 350px;
    }
    & .el-textarea{
      width: 350px;
    }
  }

</style>


