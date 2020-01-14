<template>
  <div>
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <el-form-item>
          <el-input v-model="searchData.businessName" clearable placeholder="请输入事件名称关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getPageList"
            icon="el-icon-search"
            v-if="buttonControl[_config.buttonCode.B_LIST]"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 用户列表表格 -->
    <el-table size="mini" :data="tableData.list" border style="width: 100%">
      <el-table-column prop="businessName" label="事件名称"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="scope">
          <span>{{scope.row.createTime | formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startUserRealName" label="发起人姓名"></el-table-column>
      <el-table-column prop="startUserlocationName" label="发起人地区名称"></el-table-column>
      <el-table-column prop="startUserDeptName" label="发起人所在机构名称"></el-table-column>
      <el-table-column prop="stateCn" label="业务当前状态"></el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            v-if="buttonControl[_config.buttonCode.B_DETAIL]"
            @click="handleIntoFlow(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="tableData.total"
      :page-sizes="_config.sizeArr"
      :page-size="searchData.pageSize"
      :current-page="searchData.pageNum"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!--详情组件-->
    <my-Allbusiness-Detais
      :show="showDrag"
      :taskId="taskId"
      @close="val => showDrag = val"
      @reqList="getPageList"
    ></my-Allbusiness-Detais>
  </div>
</template>

<script>
const myAllbusinessDetais = () => import("@/components/myAllbusiness/index");
import mixin from "@/mixin/buttonPermission";
export default {
  mixins: [mixin],
  name: "my-allbusiness",
  components: { myAllbusinessDetais },
  data() {
    return {
      searchData: {
        pageSize: this._config.sizeArr[0],
        pageNum: 1,
        businessName: "" //任务名称
      },
      tableData: {},
      showDrag: false, //弹窗控制
      taskId: ""
    };
  },
  created() {
    this.getPageList();
  },
  methods: {
    //获取信息列表
    getPageList() {
      this.$request
        .get(this.$apiList.allChildren, {
          params: this.searchData
        })
        .then(res => {
          this.tableData = res.data.data;
        });
    },
    //进入流程
    handleIntoFlow(data) {
      this.taskId = data.actProcInstId;
      this.showDrag = true;
    },
    // 翻页
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getPageList();
    },
    // 修改每页显示数量
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.getPageList();
    }
  }
};
</script>

<style scoped>
.el-table .cell,
.el-table th > .cell {
  text-align: center;
}
</style>

