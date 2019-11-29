<template>
  <div>
    <el-row style="background:#fff;">
      <el-col :span="12">
        <!-- 菜单树结构 -->
        <el-tree
          :default-expanded-keys="[1]"
          node-key="id"
          :data="menuTreeData"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }" @click.stop="() => handleNodeClick(data)">
            <span class="custom-tree-node-title">{{ node.label }}</span>
            <span style="display: inline-block;width: 280px;text-align: left;">
              <el-button
                type="primary"
                size="mini"
                @click.stop="() => handleNodeClick(data)"
                icon="el-icon-view"
              >详情</el-button>
              <el-button
                type="warning"
                icon="el-icon-plus"
                size="mini"
                @click.stop="() => confirmCreate(data)"
              >添加子菜单</el-button>
              <el-button
                v-if="node.level!==1"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click.stop="() => handleDelete(node, data)"
              >删除</el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="12">
        <!-- 查看菜单详情 -->
        <el-form
          :disabled="checkType"
          :model="menuDetail"
          size="mini"
          label-width="100px"
          style="width:400px;padding:20px 0 0;"
        >
          <el-form-item label="菜单名称">
            <el-input v-model="menuDetail.menuName"></el-input>
          </el-form-item>
          <el-form-item label="菜单链接">
            <el-input v-model="menuDetail.url"></el-input>
          </el-form-item>
          <el-form-item label="文件路径">
            <el-input v-model="menuDetail.menuPath"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标">
            <el-input v-model="menuDetail.icon"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序">
            <el-input v-model="menuDetail.sort"></el-input>
          </el-form-item>
          <el-form-item label="所属菜单">
            <el-cascader
              v-model="menuDetail.parentId"
              :props="prop"
              :show-all-levels="false"
              :options="menuTreeData"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="menuDetail.enabled"></el-switch>
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
            <el-button
              v-if="showMenuButton"
              type="primary"
              @click="handleCheckButton"
            >查看菜单按钮
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 查看菜单绑定的按钮详情弹窗 -->
    <el-dialog title="菜单按钮列表：" :visible.sync="showMenuButtonDetail">
      <el-table :data="menuButtonDetail" size="mini" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="buttonName" label="名称"></el-table-column>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="requestType" label="请求类型"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button size="mini" @click="showMenuButtonDetail = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from '@/mixin/buttonPermission'

  export default {
    mixins: [mixin],
    data() {
      return {
        num: 0,
        prop: {
          value: "id",
          label: "menuName",
          emitPath: false,
          checkStrictly: true
        },
        checkType: true, //区分查看还是编辑
        showMenuButton: false, //查看菜单按钮
        menuTreeData: [], //菜单树结构数据
        createMenu: null, //创建菜单
        defaultProps: {
          // 菜单树结构字段
          children: "children",
          label: "menuName"
        },
        showMenuButtonDetail: false, //查看菜单按钮详情弹窗
        menuDetail: {}, //菜单详情
        menuButtonDetail: [] //菜单按钮列表
      };
    },
    mounted() {
      this.getMenuTree();
    },
    methods: {
      // 点击查看按钮
      handleNodeClick(data) {
        this.getMenuById(data.id);
        this.showMenuButton = true;
      },
      // 查看菜单绑定的按钮
      handleCheckButton() {
        this.getMenuButtonById(this.menuDetail.id);
        this.showMenuButtonDetail = true;
      },
      // 删除菜单按钮
      handleDelete(index, row) {
        this.$confirm("此操作将永久删除该菜单及其子菜单, 是否继续?", "提示", {
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
      // 确定删除菜单
      confirmDelete(id) {
        this.$request
          .delete(this.$apiList.menu + "/" + id)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.getMenuTree();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      //刷新导航树
      refreshTree() {
        //修改后同步
        this._session.setSession('ROUTERS_LIST', [])
        this.$store.login.state.ROUTERS_LIST = []
        this.$store.dispatch('routerTree')
      },
      // 创建菜单信息
      confirmCreate(data) {
        this.createMenu = {
          //创建菜单信息
          description: "",
          enabled: "",
          icon: "",
          leaf: "",
          level: data.level + 1,
          menuName: `新增菜单-${new Date().getTime()}`,
          parentId: data.id,
          value: "",
          sort: "",
          url: "",
          menuPath: '',
        };
        this.$request
          .post(this.$apiList.menu, this.createMenu)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.createMenu = this._funs.emptyObj(this.createMenu);
            this.getMenuTree();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 确认修改菜单信息
      confirmChange() {
        this.$request
          .put(this.$apiList.menu, this.menuDetail)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.menuDetail = this._funs.emptyObj(this.menuDetail);
            this.showMenuButton = false;
            this.checkType = true;
            this.getMenuTree();
            this.refreshTree()
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询菜单按钮详情
      getMenuButtonById(id) {
        this.$request
          .get(this.$apiList.menu + "/" + id + "/buttons")
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.menuButtonDetail = data.data || [];
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询菜单详情
      getMenuById(id) {
        this.$request
          .get(this.$apiList.menu + "/" + id)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.menuDetail = data.data || {};
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询菜单树结构
      getMenuTree() {
        this.$request
          .get(this.$apiList.menu + "/all/tree")
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.menuTreeData = data.data || [];
            }
          })
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-tree {
    padding: 20px;
    padding-left: 0;
  }
</style>

