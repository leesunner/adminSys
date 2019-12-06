<template>
  <div class="permission">
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <span>
          <el-form-item>
            <el-input v-model="searchData.name" clearable placeholder="权限名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getPermissionByPage(1)" icon="el-icon-search">查询</el-button>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="showCreatePermission = true" icon="el-icon-plus">创建权限</el-button>
        </el-form-item>
        </span>
      </el-form>
    </el-row>
    <!-- 权限列表表格 -->
    <el-table :data="permissionData.list" size="mini" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="permissionName" label="名称"></el-table-column>
      <el-table-column label="操作" width="416">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-view"
            @click="handleCheck(scope.$index, scope.row)"
          >详情
          </el-button>
          <el-dropdown @command="e=>handleCheckMenu(e, scope.row)">
            <el-button
              type="success"
              size="mini"
            >查看菜单
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in _config.dict_platform_type" :key="item.key+100" :command="item.key">
                {{item.value}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="e=>handleCheckButton(e, scope.row)">
            <el-button
              type="warning"
              size="mini"
            >查看按钮
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in _config.dict_platform_type" :key="item.key+100" :command="item.key">
                {{item.value}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <!-- 创建权限弹窗 -->
    <el-dialog title="创建权限" :visible.sync="showCreatePermission">
      <el-form :model="createPermission" size="mini" :label-width="formLabelWidth">
        <el-form-item label="权限名称">
          <el-input v-model="createPermission.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input type="textarea" :rows="2" v-model="createPermission.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showCreatePermission = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </el-dialog>
    <!-- 权限拥有的按钮弹窗 -->
    <el-dialog :title="`权限按钮编辑：${rowData.permissionName}`" :visible.sync="showPermissionButtonTree" width="815px">
      <el-row style="text-align:right;">
        <el-button
          size="mini"
          v-if="checkType"
          @click="checkType = false"
        >启用编辑
        </el-button>
        <el-button size="mini" v-else @click="checkType = true">关闭编辑</el-button>
        <el-button
          size="mini"
          v-show="!checkType"
          type="primary"
          @click="confirmChangeButtonPermission"
        >保存
        </el-button>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-button
          size="mini"
          :disabled="checkType"
          type="primary"
          style="margin-right:10px;"
          @click="checkAll(true)"
        >全选
        </el-button>
        <el-button :disabled="checkType" type="info" @click="checkAll(false)" size="mini">全不选</el-button>
      </el-row>
      <el-row>
        <el-collapse v-model="activeCollapseName" accordion style="margin-bottom:20px;">
          <el-collapse-item :title="key" :name="index" v-for="(value,key,index) of buttonObj" :key="index">
            <el-col :span="4">
              <!--<span style="color:#F56C6C;display:block;">{{key}}</span>-->
              <el-link
                :disabled="checkType"
                type="primary"
                style="margin-right:10px;"
                @click="checkAllByMenu(key,true)"
              >全选本组
              </el-link>
              <el-link :disabled="checkType" type="info" @click="checkAllByMenu(key,false)">全不选</el-link>
            </el-col>
            <el-col :span="20">
              <el-checkbox
                style="width:180px;"
                v-model="item.hasPermission"
                v-for="item in value"
                :label="item.id"
                :key="item.id"
                :disabled="checkType"
              >{{item.buttonName}}
              </el-checkbox>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-row>
    </el-dialog>
    <!-- 权限拥有的菜单弹窗 -->
    <el-dialog :title="`权限菜单编辑：${rowData.permissionName}`" :visible.sync="showPermissionMenuTree" width="645px">
      <div style="text-align:right;">
        <el-button
          size="mini"
          v-if="checkType"
          @click="checkType = false"
        >启用编辑
        </el-button>
        <el-button size="mini" v-else @click="checkType = true">关闭编辑</el-button>
        <el-button size="mini" @click="showPermissionMenuTree = false">关闭</el-button>
        <el-button
          size="mini"
          v-show="!checkType"
          type="primary"
          @click="confirmChangeMenuPermission"
        >保存
        </el-button>
      </div>
      <el-tree
        :data="permissionMenuTreeData"
        show-checkbox
        :default-expanded-keys="[1]"
        ref="tree"
        node-key="id"
        :default-checked-keys="checkedNode"
        :props="menuDefaultProps"
      ></el-tree>
    </el-dialog>
    <!-- 查看权限详情弹窗 -->
    <el-dialog :title="`权限详情：${rowData.permissionName}`" :visible.sync="showPermissionDetail">
      <el-form
        :disabled="checkType"
        :model="permissionDetail"
        size="mini"
        :label-width="formLabelWidth"
      >
        <el-form-item label="权限名称">
          <el-input v-model="permissionDetail.permissionName"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input type="textarea" :rows="2" v-model="permissionDetail.description"></el-input>
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
        <el-button size="mini" @click="showPermissionDetail = false">关闭</el-button>
        <el-button size="mini" v-show="!checkType" type="primary" @click="confirmChange">保存</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      background
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="permissionData.total"
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
        activeCollapseName: '1',
        buttonObj: {}, //按钮列表对象
        checkType: true, //区分查看还是编辑
        rowData: "", //行数据
        permissionData: [], //权限列表数据
        searchData: {
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          name: ""
        },
        showCreatePermission: false, //创建权限弹窗
        showPermissionDetail: false, //查看权限详情弹窗
        showPermissionMenuTree: false, //权限拥有的菜单弹窗
        showPermissionButtonTree: false, //权限拥有的按钮弹窗
        permissionMenuTreeData: [], //权限拥有的菜单
        checkedNode: [], //默认选中的菜单
        menuDefaultProps: {
          //菜单树结构默认字段
          children: "children",
          label: "menuName",
          disabled: (data, node) => {
            return this.checkType;
          }
        },
        permissionDetail: {}, //权限详情
        createPermission: {
          //创建权限信息
          permissionName: "",
          description: ""
        },
        formLabelWidth: "90px"
      };
    },
    mounted() {
      this.getPermissionByPage();
    },
    methods: {
      // 全选所有
      checkAll(val) {
        var buttonObj = this.buttonObj;
        for (var key in buttonObj) {
          var list = buttonObj[key];
          list.forEach(item => {
            item.hasPermission = val;
          });
        }
      },
      // 菜单下的按钮全选
      checkAllByMenu(key, val) {
        var buttonObj = this.buttonObj;
        buttonObj[key].forEach(item => {
          item.hasPermission = val;
        });
      },
      // 查看权限拥有的‘按钮’按钮
      handleCheckButton(type, row) {
        this.showPermissionButtonTree = true;
        this.checkType = true;
        this.rowData = row;
        this.getPermissionAllButtonById(type, row.id);
      },
      // 查看权限拥有的菜单按钮
      handleCheckMenu(type, row) {
        this.getPermissionMenuById(type, row.id);
        this.rowData = row;
        this.checkType = true;
        this.showPermissionMenuTree = true;
      },
      // 查看权限详情按钮
      handleCheck(index, row) {
        this.checkType = true;
        this.getPermissionById(row.id);
        this.rowData = row;
        this.showPermissionDetail = true;
      },
      // 确定修改权限菜单
      confirmChangeMenuPermission() {
        var checked = [];
        // 获取包含半选中的节点
        var nodes = this.$refs.tree.getCheckedNodes(false, true);
        var len = nodes.length;
        for (var i = 0; i < len; i++) {
          checked.push(nodes[i].id);
        }
        this.$request.put(this.$apiList.menu + "/all/tree/permission", {
          permissionId: this.rowData.id,
          resourceIds: checked
        })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showPermissionMenuTree = false;
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 删除权限按钮
      handleDelete(index, row) {
        this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
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
      // 确定删除权限
      confirmDelete(id) {
        this.$request
          .delete(this.$apiList.permission + '/' + id)
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
      // 创建权限信息
      confirmCreate() {
        this.$request
          .post(this.$apiList.permission, this.createPermission)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.showCreatePermission = false;
              this.createPermission = this._funs.emptyObj(this.createPermission);
              this.getPermissionByPage();
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 确认修改权限信息
      confirmChange() {
        this.$request
          .put(this.$apiList.permission, this.permissionDetail)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showPermissionDetail = false;
            this.getPermissionByPage();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 获取当前选中的菜单
      getCheckedPermission(treeData) {
        if (treeData && treeData.length) {
          treeData.forEach(item => {
            if (item.hasOwnProperty("hasPermission")) {
              if (item.hasPermission) {
                this.checkedNode.push(item.id);
              }
            }
            if (item.hasOwnProperty("children")) {
              this.getCheckedPermission(item.children);
            }
          });
        }
        return this.checkedNode;
      },
      // 查询权限拥有的按钮(不分页)
      getPermissionAllButtonById(type, id) {
        this.$request
          .get(this.$apiList.button + "/all/tree/permission", {
            params: {
              pageNum: 1,
              pageSize: 30,
              permissionId: id,
              type: type
            }
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              var itemDetail = data.data || [];
              var len = itemDetail.list.length;
              let obj = {};
              for (var i = 0; i < len; i++) {
                var item = itemDetail.list[i];
                if (!obj[item.menuName]) {
                  obj[item.menuName] = [item];
                } else {
                  obj[item.menuName].push(item);
                }
              }
              this.buttonObj = obj;
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 确定修改权限按钮
      confirmChangeButtonPermission() {
        var checked = [];
        var buttonObj = this.buttonObj;
        // 获取选中的按钮id
        for (var key in buttonObj) {
          var list = buttonObj[key];
          list.forEach(item => {
            if (item.hasPermission) {
              checked.push(item.id);
            }
          });
        }
        this.$request
          .put(this.$apiList.button + "/all/tree/permission", {
            permissionId: this.rowData.id,
            resourceIds: checked
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showPermissionButtonTree = false;
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询权限拥有的菜单
      getPermissionMenuById(type, id) {
        this.checkedNode = [];
        this.$request
          .get(this.$apiList.menu + "/all/tree/permission", {
            params: {
              permissionId: id,
              type: type
            }
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              var itemDetail = data.data || [];
              this.checkedNode = this.getCheckedPermission(itemDetail);
              this.permissionMenuTreeData = itemDetail;
            }
          })
      },
      // 查询权限详情
      getPermissionById(id) {
        this.$request
          .get(this.$apiList.permission + '/' + id)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.permissionDetail = data.data || {};
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询权限列表
      getPermissionByPage(val) {
        if (val) {
          this.searchData.pageNum = 1;
        }
        this.$request
          .get(this.$apiList.permission, {
            params: this.searchData
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.permissionData = data.data || [];
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 翻页
      handleCurrentChange(val) {
        this.searchData.pageNum = val;
        this.getPermissionByPage();
      },
      // 修改每页显示数量
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.getPermissionByPage();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .permission
  /deep/ .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner {
    background: #409eff !important;
    border-color: #409eff !important;
  }

  .permission /deep/ .el-checkbox:last-of-type {
    margin-right: 8px;
  }

  .permission /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #338ace;
  }
</style>

