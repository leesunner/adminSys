<template>
  <div class="flow">
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <el-form-item>
          <el-input v-model="searchData.name" clearable placeholder="工作流名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchData.defKey" clearable placeholder="工作流Key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPageList" icon="el-icon-search" v-if="buttonControl[_config.buttonCode.B_LIST]">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showCreateFlow = true" icon="el-icon-plus" v-if="buttonControl[_config.buttonCode.B_CREATE]">部署工作流</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 列表表格 -->
    <el-table size="mini" :data="tableData.list" border style="width: 100%">
      <el-table-column prop="procDefId" label="流程定义ID"></el-table-column>
      <el-table-column prop="name" label="流程名称"></el-table-column>
      <el-table-column prop="defKey" label="流程Key"></el-table-column>
      <el-table-column prop="deployTime" label="流程部署时间"></el-table-column>
      <el-table-column label="操作" width="96px">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            v-if="buttonControl[_config.buttonCode.B_DETAIL]"
            @click="handleCheck(scope.row)"
          >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-image
      style="width: 1px;height: 1px;"
      ref="bigImg"
      lazy
      :preview-src-list="srcList">
    </el-image>
    <el-dialog title="部署工作流" :visible.sync="showCreateFlow" width="685px">
      <el-form inline :model="formData" size="mini">
        <el-form-item label="选择菜单" label-width="96px">
          <el-select v-model="formData.menuCode" placeholder="请选择菜单">
            <el-option
              v-for="(item,index) of menuSelect"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件"  label-width="96px">
          <el-upload
            :action="`${$baseUrl+$apiList.workFlow}/deploymentZip`"
            :data="formData"
            :headers="headers"
            ref="uploadBpmn"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-remove="()=>true"
            :on-change="(file, fileLists)=>{fileList = fileLists}"
            :before-upload="beforeFileUpload"
            :file-list="fileList"
            :auto-upload="false"
            :limit="1">
            <el-button size="small" type="primary">点击上传BPM文件</el-button>
          </el-upload>
          <el-row class="warning">
            * 文件上传只允许.zip的文件格式（里面必须包含.bpmn文件和.png）
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click.stop="submitFile">确认部署</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from '@/mixin/buttonPermission'
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    components: {ElRow},
    mixins: [mixin],
    name: "already-flow",
    data() {
      return {
        srcList: [],
        tableData: {},
        menuSelect:[
          {
            key:'ACT_DW',
            value:'党务'
          },
          {
            key:'ACT_SW',
            value:'事务'
          },
          {
            key:'ACT_CW',
            value:'财务'
          }
        ],
        searchData: {
          //用户列表查询条件
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          name: "",
          defKey: "",
        },
        showCreateFlow: false,
        headers: {
          'Authorization': `Bearer ${this._session.getSessoin('AUTH_TOKEN')}`
        },
        formData:{
          menuCode:'',
        },
        fileList:[],
      }
    },
    created() {
      this.getPageList()
    },
    methods: {
      //  获取已部署的工作流
      getPageList() {
        this.$request.get(`${this.$apiList.workFlow}/deploy`).then(res => {
          this.tableData = res.data.data
        })
      },
      //查看流程
      handleCheck(data) {
        this.srcList = []
        const url = this.$baseUrl + this.$gateway + data.procImgUrl
        this.checkImg(url)
      },
      //因为查看流程图要权限，所以做了图片流的请求
      checkImg(url) {
        this.$request.get(url,{
          responseType:'blob'
        }).then(res => {
            const src = URL.createObjectURL(res.data);
            this.srcList.push(src)
            this.$refs['bigImg'].clickHandler()
            setTimeout(()=>{
              URL.revokeObjectURL(src);
            },200)
        })
      },
      //确认部署工作流
      submitFile(){
        if (!this.formData.menuCode){
          this.$message.error('请先选择要部署的事务项')
          return
        }
        if (this.fileList.length<=0){
          this.$message.error('请先选择要部署的文件')
          return
        }
        this.$refs['uploadBpmn'].submit()
      },
      //上传成功回调
      handleAvatarSuccess(res, file, fileList) {
        if(res.code==200){
          this.$message.success('部署成功')
          this.$refs['uploadBpmn'].clearFiles()
          this.getPageList()
        }else{
          this.$message.error(res.data.msg);
        }
      },
      //上传文件拦截
      beforeFileUpload(file) {
        const _is = /(zip)+/.test(file.type)
        if (!_is) {
          this.$message.error('上传文件类型错误');
          return false
        }
        return true;
      },
      //上传出错回调
      handleAvatarError(err) {
        this.$message.error('上传发生错误')
      },
    }
  }
</script>

<style lang="scss" scoped>
  .flow {
    & /deep/ .el-image-viewer__close {
      color: #ffffff;
    }
    & /deep/ .el-image-viewer__img {
      cursor: pointer;
    }
    .warning{
      padding-left: 12px;
      font-size: 12px;
      color: #f56c6c;
      margin-top: 18px;
    }
  }
</style>
