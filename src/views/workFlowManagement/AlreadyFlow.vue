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
          <el-button type="primary" @click="getPageList" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showCreateFlow = true" icon="el-icon-plus">部署工作流</el-button>
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
  </div>
</template>

<script>
  import mixin from '@/mixin/buttonPermission'

  export default {
    mixins: [mixin],
    name: "already-flow",
    data() {
      return {
        srcList: [],
        tableData: {},
        searchData: {
          //用户列表查询条件
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          name: "",
          defKey: "",
        },
        showCreateFlow: false,
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
      //因为查看流程图要权限，所以做了图片的请求
      checkImg(url) {
        let req = new XMLHttpRequest();
        req.responseType = 'blob';
        req.open('get', url, true);
        const TOKEN = this._session.getSessoin('AUTH_TOKEN')
        req.setRequestHeader('Authorization', `Bearer ${TOKEN}`);
        req.onreadystatechange = e => {
          if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            console.log(req)
            const src = URL.createObjectURL(req.response);
            this.srcList.push(src)
            this.$refs['bigImg'].clickHandler()
            setTimeout(() => {
              URL.revokeObjectURL(src);
            }, 500)
          }
        }
        req.send(null);
        // this.$request.get(url).then(res => {
        //   console.log()
        //   // const reader= new FileReader();
        //   // reader.addEventListener("load",(e)=>{
        //   //   console.log(e)
        //   // })
        //   // console.log(res.data)
        //   // reader.readAsText(res.data);
        //   // reader.onload =(e)=>{
        //   //   console.log(e)
        //   //   // const src = URL.createObjectURL(res.data);
        //   //   // this.srcList.push(src)
        //   //   // this.$refs['bigImg'].clickHandler()
        //   // }
        // })
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
  }
</style>
