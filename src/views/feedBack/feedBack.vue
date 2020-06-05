<template>
  <div>
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <el-form-item>
          <el-input v-model="searchData.content" clearable placeholder="请输入反馈内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchData.contactWay" clearable placeholder="请输入反馈联系方式"></el-input>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-input v-model="searchData.procDefName" clearable placeholder="请输入流程名关键字"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="getPageList" icon="el-icon-search" v-if="buttonControl[_config.buttonCode.B_LIST]">查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 用户列表表格 -->
    <el-table size="mini" :data="tableData.list" border style="width: 100%">
      <el-table-column prop="contactWay" label="联系方式"></el-table-column>
      <el-table-column prop="content" label="反馈内容">
        <template v-slot="scope">
          <span class="content">{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="任务创建时间">
        <template v-slot="scope">
          <span>{{scope.row.createTime | formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="是否已读">
        <template v-slot="scope">
          <el-link :underline="false" :type="scope.row.readStatus?'success':'danger'">{{scope.row.readStatus?'已读':'未读'}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            v-if="buttonControl[_config.buttonCode.B_DETAIL]"
            @click="handleIntoFlow(scope.row)"
          >查看
          </el-button>
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
    <!--待办组件-->
    <feed-back-detail :show="showDrag" :taskId="taskId" @close="val => showDrag = val" @reqList="getPageList"></feed-back-detail>
  </div>
</template>

<script>
  const feedBackDetail =()=> import('@/components/feedBack/index');
  import mixin from '@/mixin/buttonPermission';
  export default {
    mixins: [mixin],
    name: "feed-back",
    components: {feedBackDetail},
    data() {
      return {
        searchData: {
          pageSize: this._config.sizeArr[0],
          pageNum: 1,
          content: '',
          contactWay: '',
        },
        tableData: {},
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
        this.$request.get(`${this.$apiList.feedBack}`,{
          params:this.searchData
        }).then(res => {
          this.tableData = res.data.data
        })
      },
      //进入流程
      handleIntoFlow(data) {
        this.taskId = data.id
        this.showDrag = true
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
    },
  }
</script>

<style lang="scss" scoped>
.content{
  @include text-over(1);
}
</style>

