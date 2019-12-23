<template>
  <div class="usergroup">
    <el-row>
      <el-form inline size="mini" :model="searchData">
        <span>
          <el-form-item>
            <el-input v-model="searchData.name" clearable placeholder="用户组名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getUserGroupByPage(1)" icon="el-icon-search"
                       v-if="buttonControl[_config.buttonCode.B_LIST]">查询</el-button>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" size="mini" @click="showCreateUserGroup = true" icon="el-icon-plus"
                     v-if="buttonControl[_config.buttonCode.B_CREATE]">创建用户组</el-button>
        </el-form-item>
        </span>
      </el-form>
    </el-row>
    <!-- 用户组列表表格 -->
    <el-table size="mini" :data="userGroupData.list" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="410">
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
            type="success"
            icon="el-icon-view"
            v-if="buttonControl[_config.buttonCode.B_USER_GROUP_MENBER]"
            @click="handleCheckMember(scope.$index, scope.row)"
          >查看成员
          </el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-view"
            v-if="buttonControl[_config.buttonCode.B_USERS_GROUP_ROLES]"
            @click="handleCheckRole(scope.$index, scope.row)"
          >查看角色
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
    <!-- 查看用户组角色列表弹窗 -->
    <el-dialog :title="`角色列表：${rowData.name}`" :visible.sync="showUserGroupRoleDetail">
      <el-table :data="userGroupRoleDetail" size="mini" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="角色名"></el-table-column>
        <el-table-column label="操作" width="90">
          <template v-slot="scope">
            <el-link
              type="danger"
              v-if="buttonControl[_config.buttonCode.B_DELETE_ROLE_GROUP]"
              @click="handleDelRole(scope.$index, scope.row)">移除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="`添加角色：${rowData.name}`"
        append-to-body
        :visible.sync="showEditorUserGroupRoleDetail"
      >
        <el-table
          ref="noRoleTable"
          row-key="id"
          :data="userGroupNoRoleDetail.list || []"
          style="width: 100%"
          border
          size="mini"
          @selection-change="handleSelectionRoleChange"
        >
          <el-table-column type="selection" reserve-selection width="55"></el-table-column>
          <el-table-column prop="name" label="角色名"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          background
          class="pagination"
          layout="total, sizes, prev, pager, next"
          :total="userGroupNoRoleDetail.total"
          :page-sizes="_config.sizeArr"
          :page-size="searchUserNoRole.pageSize"
          :current-page="searchUserNoRole.pageNum"
          @current-change="handleCurrentChange2"
          @size-change="handleSizeChange2"
        ></el-pagination>
        <div slot="footer">
          <el-button size="mini" @click="handleCancelRole">取消</el-button>
          <el-button size="mini" type="primary" @click="confirmChangeRole">确定</el-button>
        </div>
      </el-dialog>
      <div slot="footer">
        <el-button size="mini" @click="showUserGroupRoleDetail = false">关闭</el-button>
        <el-button
          size="mini"
          type="primary"
          v-if="buttonControl[_config.buttonCode. B_GROUP_ADD_ROLE]"
          @click="handleAddRole"
        >添加角色
        </el-button>
      </div>
    </el-dialog>
    <!-- 查看用户组成员列表弹窗 -->
    <el-dialog :title="`成员列表：${rowData.name}`" :visible.sync="showUserGroupMemberDetail">
      <el-form inline size="mini" :model="userSearchData">
        <span>
          <el-form-item>
            <el-input v-model="userSearchData.realName" clearable placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       v-if="buttonControl[_config.buttonCode. B_UNOWNE_USERLIST]"
                       size="mini"
                       @click="getUserGroupMemberById">查询</el-button>
          </el-form-item>
        </span>
      </el-form>
      <el-table :data="userGroupMemberDetail.list || []" size="mini" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="userName" label="账号名"></el-table-column>
        <el-table-column prop="realName" label="真实名"></el-table-column>
        <el-table-column label="操作" width="90">
          <template v-slot="scope">
            <el-link
              type="danger"
              v-if="buttonControl[_config.buttonCode.B_DELETE_USER_GROUP]"
              size="mini"
              @click="handleDelMember(scope.$index, scope.row)">移除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="`添加成员：${rowData.name}`"
        append-to-body
        :visible.sync="showEditorUserGroupMemberDetail"
      >
        <el-table
          ref="noMemberTable"
          row-key="userId"
          :data="userGroupNoMemberDetail.list || []"
          style="width: 100%"
          border
          size="mini"
          @selection-change="handleSelectionMemberChange"
        >
          <el-table-column type="selection" reserve-selection width="55"></el-table-column>
          <el-table-column prop="userName" label="账号名"></el-table-column>
          <el-table-column prop="realName" label="真实名"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          background
          class="pagination"
          layout="total, sizes, prev, pager, next"
          :total="userGroupNoMemberDetail.total"
          :page-sizes="_config.sizeArr"
          :page-size="searchUserNoMember.pageSize"
          :current-page="searchUserNoMember.pageNum"
          @current-change="handleCurrentChange1"
          @size-change="handleSizeChange1"
        ></el-pagination>
        <div slot="footer">
          <el-button size="mini" @click="handleCancelMember">取消</el-button>
          <el-button size="mini" type="primary" @click="confirmChangeMember">确定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        background
        class="pagination"
        layout="total, sizes, prev, pager, next"
        :total="userGroupMemberDetail.total"
        :page-sizes="_config.sizeArr"
        :page-size="userSearchData.pageSize"
        :current-page="userSearchData.pageNum"
        @current-change="handleCurrentChangeUser"
        @size-change="handleSizeChangeUser"
      ></el-pagination>
      <div slot="footer">
        <el-button size="mini" @click="showUserGroupMemberDetail = false">关闭</el-button>
        <el-button
          size="mini"
          type="primary"
          v-if="buttonControl[_config.buttonCode. B_GROUP_ADD_USER]"
          @click="handleAddMember"
        >添加成员
        </el-button>
      </div>
    </el-dialog>
    <!-- 创建用户组弹窗 -->
    <el-dialog title="创建用户组" :visible.sync="showCreateUserGroup">
      <el-form :model="createUserGroup" size="mini" :rules="createGroupForm" ref="createGroupForm"
               :label-width="formLabelWidth">
        <el-form-item label="用户组名称" prop="name">
          <el-input v-model="createUserGroup.name"></el-input>
        </el-form-item>
        <el-form-item label="用户组描述">
          <el-input type="textarea" :rows="2" v-model="createUserGroup.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showCreateUserGroup = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </el-dialog>
    <!-- 查看用户组详情弹窗 -->
    <el-dialog :title="`用户组详情：${rowData.name}`" :visible.sync="showUserGroupDetail">
      <el-form
        :disabled="checkType"
        :model="userGroupDetail"
        size="mini"
        :label-width="formLabelWidth"
      >
        <el-form-item label="用户组名称">
          <el-input v-model="userGroupDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="用户组描述">
          <el-input type="textarea" :rows="2" v-model="userGroupDetail.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="checkType = false" v-if="checkType&&buttonControl[_config.buttonCode. B_UPDATE]">
          启用编辑
        </el-button>
        <el-button size="mini" v-else @click="checkType = true">关闭编辑</el-button>
        <el-button size="mini" @click="showUserGroupDetail = false">关闭</el-button>
        <el-button size="mini" v-if="!checkType" type="primary" @click="confirmChange">保存</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      background
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="userGroupData.total"
      :page-sizes="_config.sizeArr"
      :page-size="searchData.pageSize"
      :current-page="searchData.pageNum"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
  import mixin from '@/mixin/buttonPermission'

  export default {
    mixins: [mixin],
    data() {
      return {
        checkType: true, //区分查看还是编辑
        rowIndex: "", //行索引
        rowData: "", //行数据
        userGroupData: [], //用户组列表数据
        searchData: {
          //用户组查询条件
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          name: ""
        },
        //用户组成员查询
        userSearchData: {
          //用户组查询条件
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          realName: "",
          groupId: '',
        },
        showCreateUserGroup: false, //创建用户组弹窗
        showUserGroupDetail: false, //查看用户组详情弹窗
        showUserGroupMemberDetail: false, //查看用户组成员列表弹窗
        showUserGroupRoleDetail: false, //查看用户组角色列表弹窗
        showEditorUserGroupRoleDetail: false, //编辑用户组角色弹窗
        showEditorUserGroupMemberDetail: false, //编辑用户组成员弹窗
        userGroupDetail: {}, //用户组详情
        userGroupMemberDetail: [], //用户组成员列表
        userGroupNoMemberDetail: [], //用户组未拥有的成员列表
        searchUserNoMember: {
          //用户组未拥有成员查询
          groupId: "",
          pageNum: 1,
          pageSize: this._config.sizeArr[0]
        },
        selectMemberArr: [], //选中的成员
        userGroupRoleDetail: [], //用户组角色列表
        userGroupNoRoleDetail: [], //用户组未拥有的角色列表
        searchUserNoRole: {
          //用户组未拥有角色查询
          groupId: "",
          pageNum: 1,
          pageSize: this._config.sizeArr[0]
        },
        selectRoleArr: [], //选中的角色
        createUserGroup: {
          //创建用户组信息
          name: "",
          description: ""
        },
        formLabelWidth: "120px",
        createGroupForm: {
          name: [{required: true, message: '请输入用户组名', trigger: 'blur'}]
        }
      };
    },
    mounted() {
      this.getUserGroupByPage();
    },
    methods: {
      // 查询用户组成员按钮
      handleCheckMember(index, row) {
        this.getUserGroupMemberById(row.id);
        this.rowIndex = index;
        this.rowData = row;
        this.showUserGroupMemberDetail = true;
      },
      // 移除人员
      handleDelMember(index, row) {
        this.$confirm("确定要移除该用户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var data = this.userGroupMemberDetail;
            //限制删除最后一个人员
            // data = data.splice(index, 1);
            // var userIdArr = [];
            // for (var i = 0; i < this.userGroupMemberDetail.length; i++) {
            //   userIdArr.push(this.userGroupMemberDetail[i].userId);
            // }
            this.$request
              .delete(this.$apiList.user_group + "/users", {
                params: {
                  groupId: this.rowData.id,
                  userIds: row.userId
                }
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.handleCheckMember(this.rowIndex, this.rowData);
              })
              .catch(err => {
                this.$message.error(err);
              });
          })
          .catch(() => {
            this.$message("已取消");
          });
      },
      // 添加成员
      handleAddMember() {
        this.showEditorUserGroupMemberDetail = true;
        this.searchUserNoMember.groupId = this.rowData.id;
        this.getUserGroupNoMemberById();
      },
      // 取消添加
      handleCancelMember() {
        this.showEditorUserGroupMemberDetail = false;
        this.$refs.noMemberTable.clearSelection();
      },
      // 可添加成员勾选结果
      handleSelectionMemberChange(val) {
        this.selectMemberArr = val;
      },
      // 查询用户组角色按钮
      handleCheckRole(index, row) {
        this.getUserGroupRoleById(row.id);
        this.rowIndex = index;
        this.rowData = row;
        this.showUserGroupRoleDetail = true;
      },
      // 移除角色
      handleDelRole(index, row) {
        this.$confirm("确定要移除该角色吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var data = this.userGroupRoleDetail;
            // data = data.splice(index, 1);
            // var userIdArr = [];
            // for (var i = 0; i < this.userGroupRoleDetail.length; i++) {
            //   userIdArr.push(this.userGroupRoleDetail[i].id);
            // }
            this.$request
              .delete(this.$apiList.user_group + "/roles", {
                params: {
                  groupId: this.rowData.id,
                  roleIds: row.id
                }
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.handleCheckRole(this.rowIndex, this.rowData);
              })
              .catch(err => {
                this.$message.error(err);
              });
          })
          .catch(() => {
            this.$message("已取消");
          });
      },
      // 添加角色
      handleAddRole() {
        this.selectRoleArr = [];
        this.showEditorUserGroupRoleDetail = true;
        this.searchUserNoRole.groupId = this.rowData.id;
        this.getUserGroupNoRoleById();
      },
      // 取消添加
      handleCancelRole() {
        this.showEditorUserGroupRoleDetail = false;
        this.$refs.noRoleTable.clearSelection();
      },
      // 可添加成员勾选结果
      handleSelectionRoleChange(val) {
        this.selectRoleArr = val;
      },
      // 查看用户组详情按钮
      handleCheck(index, row) {
        this.checkType = true;
        this.getUserGroupById(row.id);
        this.rowData = row;
        this.rowIndex = index;
        this.showUserGroupDetail = true;
      },
      // 确定编辑用户组角色
      confirmChangeRole() {
        // 将用户选择的可添加角色的id数组转逗号拼接的字符串
        // 添加的操作需要把已经存在的角色id也传过去
        if (this.selectRoleArr.length > 0) {
          var selectRoleArr = this.selectRoleArr.concat(this.userGroupRoleDetail);
          var len = selectRoleArr.length;
          var userIdArr = [];
          for (var i = 0; i < len; i++) {
            userIdArr.push(selectRoleArr[i].id);
          }
          this.$request
            .post(this.$apiList.user_group + "/roles", {
              groupId: this.rowData.id,
              roleIds: userIdArr.join(',')
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
              }
              this.showEditorUserGroupRoleDetail = false;
              this.showUserGroupRoleDetail = false;
              this.$refs.noRoleTable.clearSelection();
              this.handleCheckRole(this.rowIndex, this.rowData);
            })
        } else {
          this.$message.error("请先选择要添加的角色再操作");
        }
      },
      // 确定编辑用户组用户
      confirmChangeMember() {
        // 将用户选择的可添加成员的userId数组转逗号拼接的字符串
        // 添加的操作需要把已经存在的成员userId也传过去
        if (this.selectMemberArr.length > 0) {
          var selectMemberArr = this.selectMemberArr.concat(
            this.userGroupMemberDetail
          );
          var len = selectMemberArr.length;
          var userIdArr = [];
          for (var i = 0; i < len; i++) {
            userIdArr.push(selectMemberArr[i].userId);
          }
          this.$request
            .post(this.$apiList.user_group + "/users", {
              groupId: this.rowData.id,
              userIds: userIdArr.join(',')
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
              }
              this.showEditorUserGroupMemberDetail = false;
              this.showUserGroupMemberDetail = false;
              this.$refs.noMemberTable.clearSelection();
              this.handleCheckMember(this.rowIndex, this.rowData);
            })
        } else {
          this.$message.error('请先选择要添加的成员再操作')
        }
      },
      // 删除用户组按钮
      handleDelete(index, row) {
        this.$confirm("此操作将永久删除该用户组, 是否继续?", "提示", {
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
      // 确定删除用户组
      confirmDelete(id) {
        this.$request
          .delete(this.$apiList.user_group + "/" + id)
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
      // 创建用户组信息
      confirmCreate() {
        this.$refs['createGroupForm'].validate(valid => {
          if (valid) {
            this.$request
              .post(this.$apiList.user_group, this.createUserGroup)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.showCreateUserGroup = false;
                this.createUserGroup = this._funs.emptyObj(this.createUserGroup);
                this.getUserGroupByPage();
              })
          }
        })
      },
      // 确认修改用户组信息
      confirmChange() {
        this.$request
          .put(this.$apiList.user_group, this.userGroupDetail)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showUserGroupDetail = false;
            this.getUserGroupByPage();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询用户组未拥有的角色
      getUserGroupNoRoleById() {
        this.$request
          .get(this.$apiList.user_group + "/other/roles", {
            params: this.searchUserNoRole
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.userGroupNoRoleDetail = data.data || [];
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      // 查询用户组角色列表
      getUserGroupRoleById(id) {
        this.$request
          .get(this.$apiList.user_group + "/" + id + "/roles")
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.userGroupRoleDetail = data.data || [];
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      // 查询用户组未拥有的成员
      getUserGroupNoMemberById() {
        this.$request
          .get(this.$apiList.user_group + "/other/users", {
            params: this.searchUserNoMember
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.userGroupNoMemberDetail = data.data || [];
            }
          })
      },
      // 查询用户组成员列表
      getUserGroupMemberById(id) {
        if (typeof id !== 'object') {
          this.userSearchData.groupId = id
        }
        this.$request
          .get(this.$apiList.user_group + "/users", {
            params: this.userSearchData
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.userGroupMemberDetail = data.data || [];
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      // 查询用户组详情
      getUserGroupById(id) {
        this.$request
          .get(this.$apiList.user_group + "/" + id)
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
      // 查询用户组列表
      getUserGroupByPage(val) {
        if (val) {
          this.searchData.pageNum = 1;
        }
        this.$request
          .get(this.$apiList.user_group, {
            params: this.searchData
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.userGroupData = data.data || [];
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 翻页
      handleCurrentChange(val) {
        this.searchData.pageNum = val;
        this.getUserGroupByPage();
      },
      // 修改每页显示数量
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.getUserGroupByPage();
      },
      // 翻页（用户成员列表）
      handleCurrentChangeUser(val) {
        this.userSearchData.pageNum = val;
        this.getUserGroupMemberById();
      },
      // 修改每页显示数量（用户成员列表）
      handleSizeChangeUser(val) {
        this.userSearchData.pageSize = val;
        this.getUserGroupMemberById();
      },
      // 翻页（用户未拥有成员列表）
      handleCurrentChange1(val) {
        this.searchUserNoMember.pageNum = val;
        this.getUserGroupNoMemberById();
      },
      // 修改每页显示数量
      handleSizeChange1(val) {
        this.searchUserNoMember.pageSize = val;
        this.getUserGroupNoMemberById();
      },
      // 翻页（用户未拥有角色列表）
      handleCurrentChange2(val) {
        this.searchUserNoRole.pageNum = val;
        this.getUserGroupNoRoleById();
      },
      // 修改每页显示数量
      handleSizeChange2(val) {
        this.searchUserNoRole.pageSize = val;
        this.getUserGroupNoRoleById();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .usergroup /deep/ .el-checkbox:last-child {
    margin-right: 30px;
  }
</style>

