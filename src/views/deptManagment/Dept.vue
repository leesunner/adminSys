<template>
  <div class="dept">
    <!-- 添加子部门输入部门名称弹窗 -->
    <el-dialog :title="`您将在《${parentDeptName}》下添加子部门`" :visible.sync="showInputDeptName">
      <el-form :model="createDept" size="mini">
        <el-form-item label="部门名称">
          <el-input v-model="createDept.name" clearable placeholder="请输入部门名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showInputDeptName = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </el-dialog>
    <el-row >
      <el-form inline>
        <el-form-item label="请输入部门关键字:">
          <el-input
            size="small"
            placeholder="输入关键字进行搜索"
            clearable
            v-model="filterText">
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-col style="background:#fff;">
      <el-col :span="16">
        <!-- 部门树结构 -->
        <el-tree :data="deptTree"
                 class="filter-tree"
                 :filter-node-method="filterNode"
                 ref="tree"
                 default-expand-all
                 :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="custom-tree-node-title">{{ node.label }}</span>
            <span style="width:445px;text-align: left;">
              <!--<span-->
              <!--v-if="!data.dingSync"-->
              <!--@click.stop="syncToDing(data)"-->
              <!--&gt;-->
              <!--<el-button type="primary" size="mini">同步到钉钉</el-button>-->
              <!--</span>-->
              <el-button
                type="primary"
                icon="el-icon-view"
                size="mini"
                @click.stop="handleNodeClick(data)"
              >查看详情</el-button>
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-plus"
                @click.stop="handleCreate(data)"
              >添加子部门</el-button>
              <el-button
                size="mini"
                v-if="node.id !== 1"
                icon="el-icon-search"
                type="danger"
                @click.stop="handleCreateRole(data)"
              >查询角色</el-button>
              <el-button
                size="mini"
                v-if="node.id !== 1"
                icon="el-icon-search"
                type="success"
                @click.stop="handleCheckMember(data)"
              >查询用戶</el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="8">
        <!-- 部门详情 -->
        <el-form
          :model="deptDetail"
          size="mini"
          :disabled="checkType"
          label-width="100px"
          style="width:400px;padding:20px 0 0;"
        >
          <el-form-item label="部门名称">
            <el-input v-model="deptDetail.name"></el-input>
          </el-form-item>
          <el-form-item label="部门类型">
            <el-select style="width:100%;" v-model="deptDetail.type" clearable placeholder="部门类型">
              <el-option
                v-for="(item,index) of _config.dict_dept_type"
                :key="index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在部门">
            <el-cascader
              v-model="deptDetail.pid"
              :props="prop"
              :show-all-levels="false"
              :options="deptTree"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="deptDetail.enabled"></el-switch>
            <p style="color:#E6A23C">“禁用”保存后此部门将消失</p>
          </el-form-item>
        </el-form>
        <el-form label-width="100px">
          <el-form-item size="mini">
            <el-button
              v-if="checkType"
              @click="checkType = false"
            >启用编辑
            </el-button>
            <el-button v-else @click="checkType = true">关闭编辑</el-button>
            <el-button v-show="!checkType" type="primary" @click="confirmChange">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
    <!-- 查看角色列表弹窗 -->
    <el-dialog :title="`角色列表：${rowData.name}`" :visible.sync="dialogTableRoleVisible">
      <el-table :data="userGroupRoleDetail.list"
                size="mini"
                ref="multipleTable"
                border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="角色名"></el-table-column>
        <el-table-column label="操作" width="90">
          <template v-slot="scope">
            <el-button type="danger" size="mini" @click="handleDelRole(scope.$index, scope.row)">移除</el-button>
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
        <el-button size="mini" @click="dialogTableRoleVisible = false">关闭</el-button>
        <el-button
          size="mini"
          type="primary"
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
            <el-button type="primary" @click="getUserGroupMemberById">查询</el-button>
          </el-form-item>
        </span>
      </el-form>
      <el-table :data="userGroupMemberDetail.list || []" size="mini" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="username" label="账号名"></el-table-column>
        <el-table-column prop="realName" label="真实名"></el-table-column>
        <el-table-column label="操作" width="90">
          <template v-slot="scope">
            <el-button type="danger" size="mini" @click="handleDelMember(scope.$index, scope.row)">移除</el-button>
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
          <el-table-column prop="username" label="账号名"></el-table-column>
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
          @click="handleAddMember"
        >添加成员
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from '@/mixin/buttonPermission'
  import treeMixin from '@/mixin/treeSearchMixin'
  export default {
    mixins: [mixin,treeMixin],
    name: "dept",
    data() {
      return {
        checkType: true, //区分查看还是编辑
        deptDetail: {}, //部门详情
        deptTree: [], //部门树结构
        prop: {
          value: "id",
          label: "name",
          emitPath: false,
          checkStrictly: true
        },
        createDept: {
          code: "",
          description: "",
          name: "",
          pid: "",
          sort: 0,
          type: 0
        }, //新增部门
        showInputDeptName: false, //添加子部门弹窗
        parentDeptName: "", //父部门名称
        defaultProps: {
          // 部门树结构字段
          children: "children",
          label: "name"
        },
        selectRoleArr: [], //选中的角色
        userGroupRoleDetail:{},//部门拥有的角色列表
        dialogTableRoleVisible:false,//部门拥有的角色列表弹框
        rowData:{},//行信息
        showEditorUserGroupRoleDetail:false,//添加角色弹框
        userGroupNoRoleDetail:{},
        searchUserRole: {
          //用户组有角色查询
          deptId: "",
          roleName:'',
          pageNum: 1,
          pageSize: this._config.sizeArr[0]
        },
        searchUserNoRole: {
          //用户组未拥有角色查询
          deptId: "",
          pageNum: 1,
          pageSize: this._config.sizeArr[0]
        },

        //用户组成员查询
        userSearchData: {
          //用户组查询条件
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          realName: "",
          deptId:'',
        },
        showUserGroupMemberDetail: false, //查看用户组成员列表弹窗
        showUserGroupRoleDetail: false, //查看用户组角色列表弹窗
        showEditorUserGroupMemberDetail: false, //编辑用户组成员弹窗
        userGroupMemberDetail: [], //用户组成员列表
        userGroupNoMemberDetail: [], //用户组未拥有的成员列表
        searchUserNoMember: {
          //用户组未拥有成员查询
          deptId: "",
          pageNum: 1,
          pageSize: this._config.sizeArr[0]
        },
        selectMemberArr: [], //选中的成员
      };
    },
    mounted() {
      this.getDeptTree();
    },
    methods: {
      // 角色---------------------------------------
      // 查询用户组角色按钮
      handleCheckRole(index, row) {
        this.getUserGroupRoleById(row.id);
        this.rowIndex = index;
        this.rowData = row;
        this.showUserGroupRoleDetail = true;
      },
      // 可添加成员勾选结果
      handleSelectionRoleChange(val) {
        this.selectRoleArr = val;
      },
      // 移除角色
      handleDelRole(index, row) {
        this.$confirm("确定要移除该角色吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // var data = this.userGroupRoleDetail.list;
            // data = data.splice(index, 1);
            // var userIdArr = [];
            // for (var i = 0; i < this.userGroupRoleDetail.length; i++) {
            //   userIdArr.push(this.userGroupRoleDetail[i].id);
            // }
            this.$request
              .delete(this.$apiList.dept + "/roles", {
                params: {
                  deptId: this.rowData.id,
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
        this.searchUserNoRole.deptId = this.rowData.id;
        this.getUserGroupNoRoleById();
      },
      // 取消添加
      handleCancelRole() {
        this.showEditorUserGroupRoleDetail = false;
        this.$refs.noRoleTable.clearSelection();
      },
      // 确定编辑部门角色
      confirmChangeRole() {
        // 将用户选择的可添加角色的id数组转逗号拼接的字符串
        // 添加的操作需要把已经存在的角色id也传过去
        var selectRoleArr = this.selectRoleArr.concat(this.userGroupRoleDetail.list);
        var len = selectRoleArr.length;
        if (len == 0) {
          this.$message("请先选择要添加的角色再操作");
          return;
        }
        var userIdArr = [];
        for (var i = 0; i < len; i++) {
          userIdArr.push(selectRoleArr[i].id);
        }
        this.$request
          .post(this.$apiList.dept + "/roles", {
            deptId: this.rowData.id,
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
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 可添加成员勾选结果
      handleSelectionRoleChange(val) {
        this.selectRoleArr = val;
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
      },
      // 查询部门未拥有的角色
      getUserGroupNoRoleById() {
        this.$request
          .get(this.$apiList.dept + "/other/roles", {
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
      //查询已有的角色表
      handleCreateRole(data) {
        this.getUserGroupRoleById(data.id)
        this.rowData = data
        this.dialogTableRoleVisible = true
      },
      // 查询用户组角色列表
      getUserGroupRoleById(id) {
        this.searchUserRole.deptId = id
        this.$request
          .get(this.$apiList.dept + "/roles",{
            params:this.searchUserRole
          })
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
      // 用户---------------------------------------
      // 查询用户组成员按钮
      handleCheckMember(data) {
        this.getUserGroupMemberById(data.id)
        this.rowData = data
        this.showUserGroupMemberDetail = true;
      },
      // 查询用户组未拥有的成员
      getUserGroupNoMemberById() {
        this.$request
          .get(this.$apiList.dept + "/other/users", {
            params: this.searchUserNoMember
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.userGroupNoMemberDetail = data.data || [];
            }
          })
      },
      // 查询部門成员列表
      getUserGroupMemberById(id) {
        if (typeof id!=='object'){
          this.userSearchData.deptId = id
        }
        this.$request
          .get(this.$apiList.dept + `/users`,{
            params:this.userSearchData
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
      // 可添加成员勾选结果
      handleSelectionMemberChange(val) {
        this.selectMemberArr = val;
      },
      // 移除人员
      handleDelMember(index, row) {
        this.$confirm("确定要移除该用户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // var data = this.userGroupMemberDetail.list;
            // //限制删除最后一个人员
            // data = data.splice(index, 1);
            // var userIdArr = [];
            // for (var i = 0; i < this.userGroupMemberDetail.length; i++) {
            //   userIdArr.push(this.userGroupMemberDetail[i].id);
            // }
            this.$request
              .delete(this.$apiList.dept + "/users", {
                params: {
                  deptId: this.rowData.id,
                  userIds: row.id
                }
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.handleCheckMember(this.rowData);
              })
              .catch(err => {
                this.$message.error(err);
              });
          })
          .catch(() => {
            this.$message("已取消");
          });
      },
      // 取消添加
      handleCancelMember() {
        this.showEditorUserGroupMemberDetail = false;
        this.$refs.noMemberTable.clearSelection();
      },
      // 确定编辑用户组用户
      confirmChangeMember() {
        // 将用户选择的可添加成员的userId数组转逗号拼接的字符串
        // 添加的操作需要把已经存在的成员userId也传过去
        var selectMemberArr = this.selectMemberArr.concat(
          this.userGroupMemberDetail.list
        );
        var len = selectMemberArr.length;
        if (len == 0) {
          this.$message("请先选择要添加的成员再操作");
          return;
        }
        var userIdArr = [];
        for (var i = 0; i < len; i++) {
          userIdArr.push(selectMemberArr[i].id);
        }
        this.$request
          .post(this.$apiList.dept + "/users", {
            deptId: this.rowData.id,
            userIds: userIdArr.join(',')
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showEditorUserGroupMemberDetail = false;
            this.$refs.noMemberTable.clearSelection();
            this.handleCheckMember(this.rowData);
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 添加成员
      handleAddMember() {
        this.showEditorUserGroupMemberDetail = true;
        this.searchUserNoMember.deptId = this.rowData.id;
        this.getUserGroupNoMemberById();
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

      // 同步到钉钉
      syncToDing(data) {
        this.$request
          .post(`${this.$apiList.dept}/sync/${data.id}`)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.getDeptTree();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查看部门详情
      handleNodeClick(data) {
        this.getDeptById(data.id);
      },
      // 点击添加子部门
      handleCreate(data) {
        this.parentDeptName = data.name;
        this.showInputDeptName = true;
        this.createDept.pid = data.id;
      },
      // 创建部门
      confirmCreate() {
        if (this.createDept.name == "") {
          this.$message("请输入部门名称");
          return;
        }
        this.$request
          .post(this.$apiList.dept, this.createDept)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showInputDeptName = false;
            this.createDept = this._funs.emptyObj(this.createDept);
            this.getDeptTree();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 确认修改部门信息
      confirmChange() {
        this.$request
          .put(this.$apiList.dept, this.deptDetail)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.deptDetail = this._funs.emptyObj(this.deptDetail);
            this.checkType = true;
            this.getDeptTree();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询部门详情
      getDeptById(id) {
        this.$request
          .get(this.$apiList.dept + "/" + id)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.deptDetail = data.data || {};
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询部门树
      getDeptTree() {
        this.$request
          .get(this.$apiList.dept + "/all/tree?isAdmin=true")
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.deptTree = data.data || [];
            }
          })
      }
    }
  };
</script>
<style lang="scss" scoped>

</style>

