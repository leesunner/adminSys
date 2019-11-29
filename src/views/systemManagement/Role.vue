<template>
  <div class="role">
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <span>
          <el-form-item>
            <el-input v-model="searchData.roleName" clearable placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getRoleByPage(1)" icon="el-icon-search">查询</el-button>
          </el-form-item>
           <el-form-item>
          <el-button type="primary" @click="showCreateRole = true" icon="el-icon-plus">创建角色</el-button>
        </el-form-item>
        </span>
      </el-form>
    </el-row>
    <!-- 角色列表表格 -->
    <el-table
      :data="roleData.list"
      size="mini"
      :row-class-name="tableRowClassName"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="roleName" label="名称"></el-table-column>
      <el-table-column prop="roleCode" label="角色编码"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="306">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-view"
            @click="handleCheck(scope.$index, scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-view"
            @click="handleCheckPermission(scope.$index, scope.row)"
          >查看权限
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看角色权限详情弹窗 -->
    <el-dialog :title="`权限列表：${rowData.roleName}`" :visible.sync="showRolePermissionDetail">
      <el-table :data="rolePermissionDetail" size="mini" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="permissionName" label="名称"></el-table-column>
        <el-table-column label="移除权限">
          <template v-slot="scope">
            <el-link type="danger" @click="handleDelPermission(scope.$index, scope.row)">移除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="`添加权限：${rowData.roleName}`"
        append-to-body
        :visible.sync="showEditorRolePermissionDetail"
      >
        <el-table
          ref="noPermissionTable"
          row-key="id"
          :data="roleNoPermissionDetail || []"
          style="width: 100%"
          border
          size="mini"
          @selection-change="handleSelectionPermissionChange"
        >
          <el-table-column type="selection" reserve-selection width="55"></el-table-column>
          <el-table-column prop="permissionName" label="权限名"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- 接口没有分页 -->
        <!-- <el-pagination
          background
          class="pagination"
          layout="total, sizes, prev, pager, next"
          :total="roleNoPermissionDetail.total"
          :page-sizes="_config.sizeArr"
          :page-size="searchRoleNoPermission.pageSize"
          :current-page="searchRoleNoPermission.pageNum"
          @current-change="handleCurrentChange1"
          @size-change="handleSizeChange1"
        ></el-pagination>-->
        <div slot="footer">
          <el-button size="mini" @click="handleCancelPermission">取消</el-button>
          <el-button size="mini" type="primary" @click="confirmChangePermission">确定</el-button>
        </div>
      </el-dialog>
      <div slot="footer">
        <el-button size="mini" @click="showRolePermissionDetail = false">关闭</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="handleAddPermission"
        >添加权限
        </el-button>
      </div>
    </el-dialog>
    <!-- 创建角色弹窗 -->
    <el-dialog title="创建角色" :visible.sync="showCreateRole">
      <el-form :model="createRole" size="mini" :label-width="formLabelWidth">
        <el-form-item label="角色名称">
          <el-input v-model="createRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="createRole.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" :rows="2" v-model="createRole.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showCreateRole = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </el-dialog>
    <!-- 查看角色详情弹窗 -->
    <el-dialog :title="`角色详情：${rowData.roleName}`" :visible.sync="showRoleDetail">
      <el-form :disabled="checkType" :model="roleDetail" size="mini" :label-width="formLabelWidth">
        <el-form-item label="角色名称">
          <el-input v-model="roleDetail.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="roleDetail.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" :rows="2" v-model="roleDetail.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          size="mini"
          v-if="checkType"
          @click="checkType = false"
        >启用编辑
        </el-button>
        <el-button size="mini" v-else @click="checkType = true">关闭编辑</el-button>
        <el-button size="mini" @click="showRoleDetail = false">关闭</el-button>
        <el-button size="mini" v-show="!checkType" type="primary" @click="confirmChange">保存</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      background
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="roleData.total"
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
        roleData: [], //角色列表数据
        searchData: {
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          roleName: ""
        },
        showCreateRole: false, //创建角色弹窗
        showRoleDetail: false, //查看角色详情弹窗
        showRolePermissionDetail: false, //查看角色权限详情弹窗
        showEditorRolePermissionDetail: false, //编辑用户权限弹窗
        roleDetail: {}, //角色详情
        rolePermissionDetail: [], //角色权限列表
        roleNoPermissionDetail: [], //角色未拥有权限列表
        selectPermissionArr: [], //勾选的权限
        searchRoleNoPermission: {
          // 未拥有的权限查询
          roleId: ""
        },
        createRole: {
          //创建角色信息
          roleName: "",
          roleCode: "",
          description: ""
        },
        valueArr: [],
        formLabelWidth: "90px"
      };
    },
    mounted() {
      this.getRoleByPage();
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (row.sysLevel) {
          return "info-row";
        }
      },
      // 查看角色权限按钮
      handleCheckPermission(index, row) {
        this.getRolePermissionById(row.id);
        this.rowIndex = index;
        this.rowData = row;
        this.showRolePermissionDetail = true;
      },
      // 移除权限
      handleDelPermission(index, row) {
        this.$confirm("确定要移除该权限吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var data = this.rolePermissionDetail;
            data = data.splice(index, 1);
            var idArr = [];
            for (var i = 0; i < this.rolePermissionDetail.length; i++) {
              idArr.push(this.rolePermissionDetail[i].id);
            }
            this.$request
              .post(this.$apiList.role + "/permissions", {
                roleId: this.rowData.id,
                permissionIds: idArr.join()
              })
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.handleCheckPermission(this.rowIndex, this.rowData);
              })
              .catch(err => {
                this.$message.error(err);
              });
          })
          .catch(() => {
            this.$message("已取消");
          });
      },
      // 添加权限
      handleAddPermission() {
        this.selectRoleArr = [];
        this.showEditorRolePermissionDetail = true;
        this.searchRoleNoPermission.roleId = this.rowData.id;
        this.getRoleNoPermissionById();
      },
      // 取消添加
      handleCancelPermission() {
        this.showEditorRolePermissionDetail = false;
        this.$refs.noPermissionTable.clearSelection();
      },
      // 可添加成员勾选结果
      handleSelectionPermissionChange(val) {
        this.selectPermissionArr = val;
      },
      // 查看角色详情按钮
      handleCheck(index, row) {
        this.checkType = true;
        this.getRoleById(row.id);
        this.rowIndex = index;
        this.rowData = row;
        this.showRoleDetail = true;
      },
      // 确定编辑角色权限
      confirmChangePermission() {
        // 将用户选择的可添加权限的id数组转逗号拼接的字符串
        // 添加的操作需要把已经存在的权限id也传过去
        var selectPermissionArr = this.selectPermissionArr.concat(
          this.rolePermissionDetail
        );
        var len = selectPermissionArr.length;
        if (len == 0) {
          this.$message("请先选择要添加的权限再操作");
          return;
        }
        var idArr = [];
        for (var i = 0; i < len; i++) {
          idArr.push(selectPermissionArr[i].id);
        }
        this.$request
          .post(this.$apiList.role + "/permissions", {
            roleId: this.rowData.id,
            permissionIds: idArr.join()
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showEditorRolePermissionDetail = false;
            this.showRolePermissionDetail = false;
            this.$refs.noPermissionTable.clearSelection();
            this.handleCheckPermission(this.rowIndex, this.rowData);
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 删除角色按钮
      handleDelete(index, row) {
        this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
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
      // 确定删除角色
      confirmDelete(id) {
        this.$request
          .delete(this.$apiList.role + "/" + id)
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
      // 创建角色信息
      confirmCreate() {
        this.$request
          .post(this.$apiList.role, this.createRole)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.showCreateRole = false;
              this.createRole = this._funs.emptyObj(this.createRole);
              this.getRoleByPage();
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 确认修改角色信息
      confirmChange() {
        this.$request
          .put(this.$apiList.role, this.roleDetail)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showRoleDetail = false;
            this.getRoleByPage();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询角色未拥有的权限详情
      getRoleNoPermissionById(id) {
        this.$request
          .get(this.$apiList.role + "/other/permissions", {
            params: this.searchRoleNoPermission
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.roleNoPermissionDetail = data.data || [];
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      // 查询角色权限详情
      getRolePermissionById(id) {
        this.$request
          .get(this.$apiList.role + "/" + id + "/permissions")
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.rolePermissionDetail = data.data || [];
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      // 查询角色详情
      getRoleById(id) {
        this.$request
          .get(this.$apiList.role + "/" + id)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.roleDetail = data.data || {};
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询角色列表
      getRoleByPage(val) {
        if (val) {
          this.searchData.pageNum = 1;
        }
        this.$request
          .get(this.$apiList.role, {
            params: this.searchData
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.roleData = data.data || [];
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 翻页
      handleCurrentChange(val) {
        this.searchData.pageNum = val;
        this.getRoleByPage();
      },
      // 修改每页显示数量
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.getRoleByPage();
      },
      // 翻页（未拥有权限）
      handleCurrentChange1(val) {
        this.searchRoleNoPermission.pageNum = val;
        this.getRoleNoPermissionById();
      },
      // 修改每页显示数量
      handleSizeChange1(val) {
        this.searchRoleNoPermission.pageSize = val;
        this.getRoleNoPermissionById();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .role /deep/ .el-checkbox:last-child {
    margin-right: 30px;
  }

  .role /deep/ .info-row {
    color: #c0c4cc;
    font-weight: bold;
  }
</style>

