<template>
  <div>
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <el-form-item>
          <el-input v-model="searchData.name" clearable placeholder="请输入任务名关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchData.procDefName" clearable placeholder="请输入流程名关键字"></el-input>
        </el-form-item>
      </el-form>
      <el-form size="mini" inline>
        <el-form-item>
          <el-button type="primary" @click="getPageList" icon="el-icon-search">查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 用户列表表格 -->
    <el-table size="mini" :data="tableData.list" border style="width: 100%">
      <el-table-column type="taskId" label="任务ID"></el-table-column>
      <el-table-column prop="assigneeName" label="待办人"></el-table-column>
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="createTime" label="任务创建时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            @click="handleIntoFlow(scope.row)"
          >进入
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--待办组件-->
    <transaction-detail :show="showDrag" :taskId="taskId" @close="val => showDrag = val"></transaction-detail>
  </div>
</template>

<script>
  const transactionDetail =()=> import('@/components/transactionManagement/transactionDetail')
  export default {
    name: "my-wait-for-matters",
    components: {transactionDetail},
    data() {
      return {
        searchData: {
          pageSize: this._config.sizeArr,
          pageNum: 1,
          name: '',//任务名称
          procDefName: '',//流程名称
        },
        tableData: {
          list:[{
            taskId:'91657791-1aff-11ea-a536-9cb6d0202a49'
          }]
        },
        showDrag: false,//弹窗控制
        taskId: '',
      }
    },
    created() {
      this.getPageList()
    },
    methods: {
      //获取信息列表
      getPageList() {
        this.$request.get(`${this.$apiList.workFlow}/gtasks`).then(res => {
          // this.tableData = res.data.data
        })
      },
      //进入流程
      handleIntoFlow(data) {
        // this.taskId = data.id
        this.taskId = '15c1ce78-2159-11ea-b0b0-9cb6d0202a49'
        this.showDrag = true
      },
    },
  }
</script>

<style scoped>

</style>
