<template>
  <div class="column">
    <el-row class="column-header">
      <div class="column-header-title">
        <span class="column-header-title-title">栏目列表</span>
        <!--<span class="column-header-title-num">（共25条数据）</span>-->
        <span class="column-header-title-fresh" @click="getDataList" v-if="buttonControl[_config.buttonCode.B_LIST]">
          <el-tooltip class="item" effect="dark" :content="'刷新列表'" placement="right">
            <i class="el-icon-refresh"></i>
            </el-tooltip>
        </span>
      </div>
      <el-button type="primary" class="column-header-button" v-if="buttonControl[_config.buttonCode.B_CREATE]"
                 size="mini" icon="el-icon-plus"
                 @click="handleCreateColumn">
        添加顶级栏目
      </el-button>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 12px;"
      size="mini"
      tooltip-effect="dark"
      row-key="id"
      :header-row-style="{'background-color': '#f7f7f7'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="栏目名称">
      </el-table-column>
      <el-table-column
        width="310"
        label="操作">
        <template v-slot="scope">
          <!--<el-button-->
          <!--size="mini"-->
          <!--type="primary"-->
          <!--icon="el-icon-view"-->
          <!--@click="handleContent(scope.row)"-->
          <!--&gt;内容-->
          <!--</el-button>-->
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
            type="primary"
            icon="el-icon-plus"
            v-if="buttonControl[_config.buttonCode.B_CREATE]"
            @click="handleCreateColumn(scope.row)"
          >添加子栏目
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            v-if="buttonControl[_config.buttonCode.B_DELETE]"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <create-column :show="createShow" :buttonControl="buttonControl" :topId="createParentId" @close="close"
                   :columnId="columnId" :isEdit="isEdit"></create-column>
  </div>
</template>

<script>
  import createColumn from '@/components/cmsManagement/column/createColumn'

  import mixin from '@/mixin/buttonPermission'

  export default {
    mixins: [mixin],
    name: "column",
    components: {createColumn},
    data() {
      return {
        tableData: [],
        createShow: false, //创建顶级栏目弹框
        createParentId: '',//创建父ID
        isEdit: false, //编辑控制字段
        columnId: '',
      }
    },
    mounted() {
      this.getDataList()
    },
    methods: {
      //获取list数据源
      getDataList() {
        this.$request.get(`${this.$apiList.category}/all/tree`).then(res => {
          this.tableData = res.data.data
        })
      },
      //内容
      handleContent(index, data) {
      },
      //关闭
      close(data) {
        this.createShow = false
        this.isEdit = false
        this.columnId = ''
        this.getDataList()
      },
      //编辑
      handleEdit(data) {
        this.columnId = data.id
        this.createShow = true
        this.isEdit = true
      },
      //添加栏目
      handleCreateColumn(data) {
        this.createShow = true
        if (data.id != undefined) {
          this.createParentId = data.id
        }
      },
      //删除栏目
      handleDelete(data) {
        this.$confirm("此操作将永久删除该栏目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$request.delete(`${this.$apiList.category}/${data.id}`).then(res => {
              this.getDataList()
            })
          })
          .catch(() => {
            this.$message("已取消删除");
          });
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
