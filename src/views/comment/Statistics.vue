<template>
  <div class="statistics">
    <el-row>
      <el-form inline size="mini" :model="searchData">
        <span>
          <el-form-item>
            <el-cascader
              v-model="searchData.organizationCode"
              @change="changeVal"
              :options="columnOptions"
              :props="{
            value:'code',
            label:'name',
            emitPath: false,
            checkStrictly: true}"
              clearable
              filterable
              placeholder="请选择组织机构"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="getCommentList()"
              icon="el-icon-search"
              v-if="buttonControl[_config.buttonCode.B_LIST]"
            >查询</el-button>
          </el-form-item>
        </span>
      </el-form>
    </el-row>
    <!-- 评价列表 -->
    <el-table size="mini" :data="CommentList.list" border style="width: 100%" header-align="center">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="organizationName" label="所属组织" align="center"></el-table-column>
      <el-table-column prop="businessInfoUserRealName" label="办事员真实名称" align="center"></el-table-column>
      <el-table-column prop="gradeLabel" label="评论等级" align="center"></el-table-column>
      <el-table-column prop="realName" label="评论人真实名称" align="center"></el-table-column>
      <el-table-column prop="telephone" label="评论人手机号" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template v-slot="scope">
          <span>{{scope.row.createTime | formatTime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="CommentList.total"
      :page-sizes="_config.sizeArr"
      :page-size="searchData.pageSize"
      :current-page="searchData.pageNum"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import mixin from "@/mixin/buttonPermission";

export default {
  mixins: [mixin],
  data() {
    return {
      CommentList: [], //评价列表数据
      columnOptions: [],
      //评价查询条件
      searchData: {
        businessInfoUserRealName: "",
        organizationCode: "",
        grade: "",
        realName: "",
        telephone: "",
        pageNum: 1,
        pageSize: this._config.sizeArr[0]
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    this.getCommentList(); // 评价列表展示

    this.getColumnTree();
  },
  methods: {
    changeVal(val) {
      if (val != null) {
        this.searchData.organizationCode = val;
      } else {
        this.searchData.organizationCode = "";
      }
    },
    //获取栏目
    getColumnTree() {
      this.$request
        .get(this.$apiList.dept + "/all/tree?isAdmin=true")
        .then(res => {
          this.columnOptions = res.data.data;
        });
    },
    // 评价列表展示
    getCommentList() {
      this.$request
        .get(this.$apiList.commentList, {
          params: this.searchData
        })
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.CommentList = data.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 翻页
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getCommentList();
    },
    // 修改每页显示数量
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.getCommentList();
    }
  }
};
</script>
<style lang="scss" scoped>
.statistics /deep/ .el-checkbox:last-child {
  margin-right: 30px;
}
</style>

