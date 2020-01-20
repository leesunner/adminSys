<template>
  <div>
    <el-row>
      <el-radio-group v-model="checkBoxType" size="small" @change="getMenuTree">
        <el-radio-button :label="1">管理端</el-radio-button>
        <el-radio-button :label="2">展示端</el-radio-button>
      </el-radio-group>
      <!--<el-col :span="4">-->
        <!--<el-button-->
          <!--type="primary"-->
          <!--v-if="buttonControl[_config.buttonCode.B_CREATE]"-->
          <!--icon="el-icon-plus"-->
          <!--size="small"-->
          <!--@click="showDialogCreate({id:0})"-->
        <!--&gt;添加一级菜单-->
        <!--</el-button>-->
      <!--</el-col>-->
    </el-row>
    <el-row style="margin-top: 12px;" class="search">
      <el-form inline>
        <el-form-item label="菜单名称:">
          <el-input
            size="small"
            placeholder="输入关键字进行搜索"
            clearable
            v-model="filterText">
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <!--创建菜单-->
    <el-dialog title="添加菜单" :visible.sync="dialogVisible">
      <el-form
        :model="createMenu"
        size="mini"
        label-width="100px"
        :rules="rules"
        ref="formRules"
        style="width:400px;padding:20px 0 0;"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="createMenu.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接">
          <el-input v-model="createMenu.url"></el-input>
        </el-form-item>
        <el-form-item label="文件路径">
          <el-input v-model="createMenu.menuPath"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="createMenu.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序">
          <el-input-number v-model="menuDetail.sort" :min="1" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="所属菜单" prop="parentId">
          <el-cascader
            v-model="createMenu.parentId"
            :props="prop"
            :show-all-levels="false"
            :options="menuTreeData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="createMenu.enabled"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmCreate" v-if="buttonControl[_config.buttonCode.B_CREATE]">
          提交
        </el-button>
      </div>
    </el-dialog>
    <el-row style="background:#fff;">
      <el-col :span="9" style="min-width: 456px;max-width: 600px;">
        <!-- 菜单树结构 -->
        <el-tree
          :default-expanded-keys="expandedKeys"
          node-key="id"
          class="filter-tree"
          :filter-node-method="filterNode"
          ref="tree" :accordion="true"
          :data="menuTreeData"
          :props="defaultProps"
          highlight-current
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="custom-tree-node-title">{{ node.label }}</span>
            <span style="display: inline-block;width: 280px;text-align: left;">
              <el-button
                :type="menuDetail.id==data.id?'primary':''"
                size="mini"
                @click.stop="() => handleNodeClick(data)"
                v-if="buttonControl[_config.buttonCode.B_DETAIL]"
                icon="el-icon-view"
              >详情</el-button>
              <el-button
                type="warning"
                v-if="buttonControl[_config.buttonCode.B_CREATE]"
                icon="el-icon-plus"
                size="mini"
                @click.stop="() => showDialogCreate(data)"
              >添加子菜单</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                v-if="data.level>1&&buttonControl[_config.buttonCode.B_DELETE]"
                @click.stop="() => handleDelete(node, data)"
              >删除</el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="10" v-show="menuDetail.id" style="margin-left: 8px;">
        <!-- 查看菜单详情 -->
        <el-form
          :disabled="checkType"
          :model="menuDetail"
          size="mini"
          :rules="rules"
          ref="formEditRules"
          label-width="100px"
          style="width:400px;padding:20px 0 0;"
        >
          <el-form-item label="菜单名称" prop="menuName">
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
            <el-input-number v-model="menuDetail.sort" :min="1" :max="200"></el-input-number>
          </el-form-item>
          <el-form-item label="所属菜单" prop="parentId">
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
        <el-row style="text-align: right;width: 400px;">
          <el-button
            size="mini"
            @click="checkType = false"
            v-if="buttonControl[_config.buttonCode.B_UPDATE]&&checkType"
          >启用编辑
          </el-button>
          <el-button v-else @click="checkType = true" size="mini">关闭编辑</el-button>
          <el-button type="primary"
                     @click="confirmChange"
                     size="mini"
                     v-if="!checkType&&buttonControl[_config.buttonCode.B_UPDATE]">保存
          </el-button>
          <el-button
            size="mini"
            v-if="showMenuButton&&buttonControl[_config.buttonCode.B_LIST]"
            type="primary"
            @click="handleCheckButton"
          >查看菜单按钮
          </el-button>
        </el-row>
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
  import treeMixin from '@/mixin/treeSearchMixin'

  export default {
    mixins: [mixin, treeMixin],
    data() {
      return {
        expandedKeys:[1,2],
        dialogVisible: false,//创建弹框
        num: 0,
        checkBoxType: 1,
        prop: {
          value: "id",
          label: "menuName",
          emitPath: false,
          checkStrictly: true
        },
        checkType: true, //区分查看还是编辑
        showMenuButton: false, //查看菜单按钮
        menuTreeData: [], //菜单树结构数据
        createMenu: {
          //创建菜单信息
          description: "",
          enabled: "",
          icon: "",
          leaf: "",
          level: 0,
          menuName: ``,
          parentId: '',
          value: "",
          sort: 1,
          url: "",
          menuPath: '',
          type: '',
        }, //创建菜单
        defaultProps: {
          // 菜单树结构字段
          children: "children",
          label: "menuName"
        },
        showMenuButtonDetail: false, //查看菜单按钮详情弹窗
        menuDetail: {}, //菜单详情
        menuButtonDetail: [], //菜单按钮列表
        rules: {
          menuName: [{required: true, message: '请输入菜单名', trigger: 'blur'}],
          parentId: [{required: true, message: '请选择所属菜单', trigger: 'blur'}],
        }
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
        this._funs.setCacheInfo('ROUTERS_LIST', [])
        this.$store.login.state.ROUTERS_LIST = []
        this.$store.dispatch('routerTree')
      },
      //添加创建弹框
      showDialogCreate(data) {
        this.createMenu.parentId = data.id
        this.createMenu.type = parseInt(this.checkBoxType)
        this.createMenu.level = data.level + 1
        this.dialogVisible = true
        this.expandedKeys = [data.id]
      },
      // 创建菜单信息
      confirmCreate() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            this.$request
              .post(this.$apiList.menu, this.createMenu)
              .then(res => {
                this.dialogVisible = false
                this.$message.success(res.data.msg);
                this.createMenu = this._funs.emptyObj(this.createMenu);
                this.createMenu.level = 0
                this.createMenu.sort = 1
                this.getMenuTree();
              })
              .catch(err => {
                this.$message.error(err);
              });
          }
        })
      },
      // 确认修改菜单信息
      confirmChange() {
        this.$refs['formEditRules'].validate(valid => {
          if (valid) {
            if (this.menuDetail.id !== "") {
              this.$request
                .put(this.$apiList.menu, this.menuDetail)
                .then(res => {
                  this.$message.success(res.data.msg);
                  this.showMenuButton = false;
                  this.checkType = true;
                  this.getMenuTree();
                  this.refreshTree()
                  this.expandedKeys = [this.menuDetail.id]
                })
            }else{
              this.$message.success('请先选择菜单');
            }
          }
        })
      },
      // 查询菜单按钮详情
      getMenuButtonById(id) {
        this.$request
          .get(this.$apiList.menu + "/" + id + "/buttons")
          .then(res => {
            const data = res.data;
            this.menuButtonDetail = data.data || [];
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
            const data = res.data;
            this.menuDetail = data.data || {};
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询菜单树结构
      getMenuTree() {
        this.$request
          .get(this.$apiList.menu + "/all/tree/" + this.checkBoxType)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.menuTreeData = data.data || [];
              this.handleNodeClick(data.data[0])
            }
          })
      }
    }
  };
</script>
<style lang="scss" scoped>
  .search {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .el-tree {
    padding: 20px 0 20px 20px;
  }
</style>

