<template>
  <div>
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <span>
          <el-form-item>
            <el-input v-model="searchData.title" clearable placeholder="输入标题名"></el-input>
          </el-form-item>
          <el-form-item>
          <el-select
            v-model="searchData.siteId"
            filterable
            clearable
            remote
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
        <el-form-item>
          <el-cascader
            v-model="searchData.categoryId"
            @change="changeVal"
            :options="columnOptions"
            :props="{
            value:'id',
            label:'name',
            emitPath: false,
            checkStrictly: true}"
            clearable></el-cascader>
        </el-form-item>
          <el-form-item>
          <el-select
            v-model="searchData.type"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请选择专题分类">
            <el-option
              v-for="item in _config.dict_wordType"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
          <el-select
            v-model="searchData.auditStatus"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请选择审核状态">
            <el-option
              v-for="item in _config.dict_auditStatus"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getListByPage" v-if="buttonControl[_config.buttonCode.B_LIST]" icon="el-icon-search">查询</el-button>
          </el-form-item>
           <el-form-item>
          <el-button type="primary" @click="showCreate = true" icon="el-icon-plus" v-if="buttonControl[_config.buttonCode.B_CREATE]">发布文章</el-button>
        </el-form-item>
        </span>
      </el-form>
    </el-row>
    <div>
      <!-- 列表表格 -->
      <el-table size="mini"
                :data="contentData.list"
                tooltip-effect="dark"
                :header-row-style="{'background-color': '#f7f7f7'}"
                ref="multipleTable"
                style="width: 100%">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="title" label="标题" width="250"></el-table-column>
        <el-table-column prop="siteName" label="所属站点"></el-table-column>
        <el-table-column prop="categoryName" label="所属栏目"></el-table-column>
        <!--<el-table-column prop="description" label="文章摘要"></el-table-column>-->
        <el-table-column prop="keywords" label="关键字"></el-table-column>
        <!--<el-table-column prop="author" label="作者"></el-table-column>-->
        <el-table-column label="专题分类">
            <template v-slot="scope">
              {{formatTpye(scope.row.type)}}
            </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template v-slot="scope">
            <el-link :type="scope.row.auditStatus?'success':'danger'">{{scope.row.auditStatus?'已通过':'未通过'}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template v-slot="scope">
            {{scope.row.createTime|formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="380">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-view"
              v-if="buttonControl[_config.buttonCode.B_DETAIL]"
              @click="handleEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              :type="scope.row.hideStatus?'danger':'success'"
              size="mini"
              icon="el-icon-edit"
              v-if="buttonControl[_config.buttonCode.B_STATUS]"
              @click="handleHide( scope.row)"
            >{{scope.row.hideStatus?'已隐藏':'已显示'}}
            </el-button>
            <el-button
              :type="scope.row.auditStatus?'success':'warning'"
              size="mini"
              icon="el-icon-view"
              v-if="buttonControl[_config.buttonCode.B_EXAMINE]"
              @click="handleLook(scope.row)"
            >{{scope.row.auditStatus?'已审核':'未审核'}}
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-upload2"
              v-if="buttonControl[_config.buttonCode.B_TOP]"
              @click="handleTop(scope.row)"
            >置顶
            </el-button>
            <!--<el-button-->
              <!--type="warning"-->
              <!--size="mini"-->
              <!--icon="el-icon-edit"-->
              <!--@click="handleDelete(scope.row)"-->
            <!--&gt;删除-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        class="pagination"
        layout="total, sizes, prev, pager, next"
        :total="contentData.total"
        :page-sizes="_config.sizeArr"
        :page-size="searchData.pageSize"
        :current-page="searchData.pageNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <!--发布文档弹框-->
    <create-word :show="showCreate" :buttonControl="buttonControl" @close="close" :itemId="wordId" :columnOptions="columnOptions"></create-word>
    <!--审核-->
    <el-dialog title="审核" :visible.sync="auditingShow">
      <el-form label-width="100px"
               size="mini"
               :rules="rulesAuditing"
               ref="auditing"
               :model="auditing">
        <el-form-item label="审核意见" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="输入审核意见"
            clearable
            v-model="auditing.description">
          </el-input>
        </el-form-item>
        <el-form-item label="是否通过" prop="auditStatus">
          <el-tooltip :content="auditing.auditStatus?'通过':'不通过'" placement="right">
            <el-switch
              v-model="auditing.auditStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false">
            </el-switch>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="auditingShow=false">关闭</el-button>
        <el-button size="mini" @click="auditingSubmit" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import createWord from '../../components/cmsManagement/content/createWord';

  import mixin from '@/mixin/buttonPermission'
  export default {
    mixins: [mixin],
    name: "cms-content",
    components:{createWord},
    data(){
      return{
        //查询提交的数据
        searchData:{
          title:'',
          pageSize:this._config.sizeArr[0],
          pageNum: 1,
          siteId:'',
          categoryId:'',
          auditStatus:'',
          type:'',
        },

        //站点查询
        searchWebData: {
          pageSize: this._config.sizeArr[0],
          pageNum: 1,
          keywords: '',//站点关键字搜索
          name:'',
          domain:'',
        },
        //新增文档弹框
        showCreate:false,
        //表格列表数据源
        contentData:{},
        //对应文档ID
        wordId:"",
        //多选数据源
        multipleSelection:[],
        columnOptions:[],
        loading:false,
        webOptions:[],
        //审核
        auditing:{
          articleId: '',
          auditStatus: true,
          description: '',
        },
        auditingShow:false,
        rulesAuditing:{
          auditStatus:[{required: true, message: '请选择是否通过', trigger: 'change'}],
          description:[{required: true, message: '请输入意见', trigger: 'blur'}]
        }
      }
    },
    created(){
      this.getListByPage()
      this.getColumnTree()
      this.getSites()
    },
    methods:{
      changeVal(val){
        if (val!=null){
          this.searchData.categoryId = val
        }else{
          this.searchData.categoryId = ''
        }
      },
      //关闭
      close(val){
        this.showCreate = false
        this.wordId = ''
        // if (val !=undefined){
        //   this.getListByPage()
        // }
      },
      //过滤信息
      formatTpye(val){
        const arr = this._config.dict_wordType
        let str=''
        for (let i in arr){
          if (arr[i].key==val){
            str = arr[i].value
            break;
          }
        }
        return str
      },
      //获取栏目
      getColumnTree(){
        this.$request.get(`${this.$apiList.category}/all/tree`).then(res => {
          this.columnOptions = res.data.data
        })
      },
      //搜索获取站点
      remoteMethod(){
        if (!this.loading){
          this.loading = true
          this.getSites()
        }else{
          this.$message.warning('正在查询中...')
        }
      },
      getSites(){
        this.$request.get(`${this.$apiList.website}`, {
          params: this.searchWebData
        }).then(res => {
          this.loading = false
          this.webOptions = res.data.data.list
        })
      },
      //获取文章列表
      getListByPage(){
        this.getList()
      },
      getList(){
        this.$request.get(`${this.$apiList.article}/page`,{
          params:this.searchData
        }).then(res=>{
          this.contentData = res.data.data
        })
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      //隐藏文章
      handleHide(data) {
        this.$request.put(`${this.$apiList.article}/hide`,{
          id:data.id,
          hideStatus:!data.hideStatus
        }).then(res=>{
          this.$message.success('操作成功')
          this.getListByPage()
        })
      },
      //编辑
      handleEdit(data) {
        this.wordId= data.id
        this.showCreate = true
      },
      //删除栏目
      handleDelete() {},
      //审核
      handleLook(data){
        if (!data.auditStatus){
          this.auditing.articleId = data.id
          this.auditingShow = true
        }else{
          this.$message.warning('该文章已审核')
        }
      },
      //提交审核
      auditingSubmit(){
        this.$refs['auditing'].validate(valid => {
          if (valid) {
            this.$request.put(`${this.$apiList.article}/auditing`,this.auditing).then(res=>{
              this.$message.success('操作成功')
              this.auditingShow = false
              this.getListByPage()
            })
          }
        })
      },
      //置顶
      handleTop(data){
        this.$request.put(`${this.$apiList.article}/top`,{
          id:data.id,
          topStatus:!data.topStatus
        }).then(res=>{
          this.$message.success('操作成功')
          this.getListByPage()
        })
      },
      // 翻页
      handleCurrentChange(val) {
        this.searchData.pageNum = val;
        this.getListByPage();
      },
      // 修改每页显示数量
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.getListByPage();
      }
    }
  }
</script>

<style scoped>

</style>
