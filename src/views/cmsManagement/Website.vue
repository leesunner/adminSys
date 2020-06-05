<template>
  <div class="column">
    <el-row class="column-header">
      <div class="column-header-title">
        <span class="column-header-title-title">站点列表</span>
        <span class="column-header-title-num">（共{{tableData.total}}条数据）</span>
        <span class="column-header-title-fresh" @click="getDataList" v-if="buttonControl[_config.buttonCode.B_LIST]">
            <el-tooltip class="item" effect="dark" :content="'刷新列表'" placement="right">
            <i class="el-icon-refresh"></i>
            </el-tooltip>
        </span>
      </div>
      <el-button type="primary" class="column-header-button" size="mini" icon="el-icon-plus"
                 @click="createShow = true" v-if="buttonControl[_config.buttonCode.B_CREATE]">
        添加站点
      </el-button>
    </el-row>
    <el-table
      :data="tableData.list"
      style="width: 100%;margin-top: 12px;"
      size="mini"
      tooltip-effect="dark"
      :header-row-style="{'background-color': '#f7f7f7'}">
      <el-table-column
        prop="id"
        label="ID"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="站点名称">
      </el-table-column>
      <el-table-column
        prop="title"
        label="站点标题">
      </el-table-column>
      <el-table-column
        prop="domain"
        label="站点连接">
      </el-table-column>
      <el-table-column
        prop="discription"
        label="站点描述">
      </el-table-column>
      <el-table-column
        width="310"
        label="操作">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddColumn(scope.row)"
            v-if="buttonControl[_config.buttonCode.B_DETAIL_COLUMN]"
          >分配栏目
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            v-if="buttonControl[_config.buttonCode.B_DETAIL]"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            :type="scope.row.hideStatus?'danger':'success'"
            :icon="scope.row.hideStatus?'el-icon-minus':'el-icon-view'"
            v-if="buttonControl[_config.buttonCode.B_STATUS]"
            @click="handleStatus(scope.row)"
          >{{scope.row.hideStatus?'已隐藏':'已显示'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--创建和编辑组件-->
    <create-website :show="createShow" :buttonControl="buttonControl"  @close="handleClose" :itemId="editId"></create-website>
    <!--添加栏目组件-->
    <website-add-column :show="createColumnShow" :buttonControl="buttonControl" @close="handleColumnClose" :itemId="editId"></website-add-column>
  </div>
</template>

<script>
  const createWebsite = ()=>import('@/components/cmsManagement/createWebsite/createWebsite')
  const websiteAddColumn = ()=>import('@/components/cmsManagement/createWebsite/websiteAddColumn')

  import mixin from '@/mixin/buttonPermission'
  export default {
    mixins: [mixin],
    name: "website",
    components: {createWebsite,websiteAddColumn},
    data() {
      return {
        searchData: {
          pageSize: this._config.sizeArr[0],
          pageNum: 1,
          keywords: '',//站点关键字搜索
          name:'',
          domain:'',
        },
        tableData: [],
        createShow: false, //创建/编辑站点弹框
        createColumnShow:false,//显示栏目组件
        editId: '',//获得的站点ID
      }
    },
    mounted() {
      this.getDataList()
    },
    methods: {
      //获取list数据源
      getDataList() {
        this.$request.get(`${this.$apiList.website}`, {
          params: this.searchData
        }).then(res => {
          this.tableData = res.data.data
        })
      },
      //编辑
      handleEdit(data) {
        this.editId = data.id
        this.createShow = true
      },
      //关闭站点弹框回调
      handleClose(val) {
        this.createShow = val
        this.editId = ''
      },
      //关闭栏目弹框
      handleColumnClose(val){
        this.createColumnShow = val
      },
      //编辑栏目
      handleAddColumn(data){
        this.editId = data.id
        this.createColumnShow = true
      },
      //显隐站点
      handleStatus(data) {
        let paras = {
          id: data.id,
          hideStatus: !data.hideStatus
        }
        this.$request.put(`${this.$apiList.website}/hide`, paras).then(res => {
          this.$message.success('操作成功')
          this.getDataList()
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .column {
    &-header {
      position: relative;
      overflow: hidden;
      padding: 10px 15px;
      &-title {
        float: left;
        border-left: solid 3px $primary;
        padding-left: 6px;
        font-size: 16px;
        color: black;
        &-num {
          color: $gay;
          font-size: 12px;
        }
        &-fresh {
          color: $primary;
          cursor: pointer;
        }
      }
      &-button {
        float: right;
      }
    }
  }
</style>
