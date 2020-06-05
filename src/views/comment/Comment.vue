<template>
  <div class="comment">
    <el-row>
      <el-form inline size="mini" :model="searchData">
        <span>
          <el-form-item>
            <el-input v-model="searchData.businessInfoUserRealName" clearable placeholder="办事员真实名称"></el-input>
          </el-form-item>
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
          <el-select v-model="searchData.grade" clearable placeholder="请选择评价等级" class="agrades">
            <el-option
              v-for="item in gradesList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-form-item>
            <el-input v-model="searchData.realName" clearable placeholder="评论人真实名称"></el-input>
          </el-form-item>
          <el-form-item
            prop="telephone"
            :rules="[{ type: 'number', message: '手机号必须为数字值'}]"
          >
            <el-input
              type="telephone"
              v-model.number="searchData.telephone"
              clearable
              placeholder="评论人手机号"
              auto-complete="off"
            ></el-input>
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
    <el-table size="mini" :data="CommentList.list" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"</el-table-column>
      <el-table-column prop="organizationName" label="所属组织"</el-table-column>
      <el-table-column prop="businessInfoUserRealName" label="办事员真实名称"></el-table-column>
      <el-table-column prop="score" label="评分" width="65"></el-table-column>
      <el-table-column label="评论等级">
        <template v-slot="scope">
          <div :class="scope.row.gradeLabel=='差评'?'red':''">{{scope.row.gradeLabel}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="评论人真实名称"></el-table-column>
      <el-table-column prop="telephone" label="评论人手机号"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="scope">
          <span>{{scope.row.createTime | formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-view"
            v-if="buttonControl[_config.buttonCode.B_DETAIL]"
            @click="handleCheck(scope.$index, scope.row)"
          >详情
          </el-button>

          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            v-if="buttonControl[_config.buttonCode.B_DELETE]"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看评价详情弹窗 -->
    <el-dialog title="评价详情" :visible.sync="showUserGroupDetail">
      <el-form
        :disabled="checkType"
        :model="userGroupDetail"
        size="mini"
        :label-width="formLabelWidth"
      >
        <el-form-item label="所属组织 :">
          <el-input v-model="userGroupDetail.organizationName"></el-input>
        </el-form-item>
        <el-form-item label="办事员真实名称 :">
          <el-input v-model="userGroupDetail.businessInfoUserRealName"></el-input>
        </el-form-item>
        <el-form-item label="评论等级 :">
          <el-input v-model="userGroupDetail.gradeLabel"></el-input>
        </el-form-item>
        <el-form-item label="评论内容 :">
          <el-input type="textarea" :min="3" :max="5" v-model="userGroupDetail.content"></el-input>
        </el-form-item>
        <el-form-item label="评论人真实名称 :">
          <el-input v-model="userGroupDetail.realName"></el-input>
        </el-form-item>
        <el-form-item label="评论人手机号 :">
          <el-input v-model="userGroupDetail.telephone"></el-input>
        </el-form-item>
        <el-form-item label="创建时间 :">
          <template>
            <span>{{userGroupDetail.createTime | formatTime}}</span>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showUserGroupDetail = false">关闭</el-button>
      </div>
    </el-dialog>
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
        checkType: true, //区分查看还是编辑
        rowIndex: "", //行索引
        rowData: "", //行数据
        CommentList: [], //评价列表数据
        gradesList: [], // 评价等级下拉数据
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
        showUserGroupDetail: false, //查看评价详情弹窗
        showUserGroupRoleDetail: false, //查看评价列表弹窗
        userGroupDetail: {}, //评价详情
        formLabelWidth: "120px"
      };
    },
    created() {
      this.getCommentList(); // 评价列表展示
      this.commentGrades(); // 评价等级
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
      // 评价等级列表
      commentGrades() {
        this.$request
          .get(this.$apiList.commentGrades)
          .then(res => {
            let data = res.data;
            if (data.code == 200) {
              this.gradesList = data.data;
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询评价详情
      getCommentListId(id) {
        this.$request
          .get(this.$apiList.commentList + "/" + id)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.userGroupDetail = data.data || {};
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查看评价详情按钮
      handleCheck(index, row) {
        this.checkType = true;
        this.getCommentListId(row.id);
        this.rowData = row;
        this.rowIndex = index;
        this.showUserGroupDetail = true;
      },
      // 删除
      handleDelete(index, row) {
        this.$confirm("此操作将永久删除该评价, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.confirmDelete(row.id);
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      },
      // 确定删除
      confirmDelete(id) {
        this.$request
          .delete(this.$apiList.commentList + "/" + id)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.handleCurrentChange(1);
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
  .comment /deep/ .el-checkbox:last-child {
    margin-right: 30px;
  }

  .agrades /deep/ .el-input__inner {
    position: relative;
    top: 2px;
    font-size: 12px;
    height: 28px !important;
    line-height: 28px !important;
  }

  .agrades /deep/ .el-icon-arrow-up:before,
  .agrades /deep/ .el-icon-arrow-up:after {
    position: relative;
    top: -7px;
  }

  .agrades /deep/ .el-select .el-input .el-select__caret {
    position: relative;
    top: 4px;
  }

  .agrades {
    margin-right: 10px;
  }
  .red{
    color: #ff0400;
  }
</style>

