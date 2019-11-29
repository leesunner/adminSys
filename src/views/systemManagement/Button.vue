<template>
  <div>
    <el-row>
      <el-form size="mini">
        <el-form-item>
          <el-button type="primary" @click="showCreateButton = true" icon="el-icon-plus">创建按钮</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-col style="background:#fff;">
      <el-col :span="10">
        <!-- 菜单树结构 -->
        <el-tree
          :default-expanded-keys="[1]"
          node-key="id"
          :data="menuTreeData"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.level == 1">
              <el-button size="mini" @click.stop="() => handleNodeClick(data)">公共按钮</el-button>
            </span>
            <span v-if="data.level == 3">
              <el-button size="mini" @click.stop="() => handleNodeClick(data)" icon="el-icon-view">按钮列表</el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="14" style="padding:20px 20px 20px 0;">
        <!-- 按钮列表表格 -->
        <el-table :data="menuButtonDetail" size="mini" border>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="buttonName" label="名称"></el-table-column>
          <el-table-column prop="buttonCode" label="按钮代码"></el-table-column>
          <el-table-column prop="url" label="请求地址"></el-table-column>
          <el-table-column prop="enabledVal" label="按钮状态" width="80"></el-table-column>
          <el-table-column label="详情" width="80">
            <template v-slot="scope">
              <el-link type="primary" @click="handleCheck(scope.$index, scope.row)" icon="el-icon-view">查看</el-link>
            </template>
          </el-table-column>
          <el-table-column label="删除" width="80">
            <template v-slot="scope">
              <el-link type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-col>
    <!-- 创建按钮弹窗 -->
    <el-dialog title="创建按钮" :visible.sync="showCreateButton">
      <el-form :model="createButton" size="mini" :label-width="formLabelWidth">
        <el-form-item label="按钮名称">
          <el-input v-model="createButton.buttonName"></el-input>
        </el-form-item>
        <el-form-item label="按钮代码">
          <el-input v-model="createButton.buttonCode"></el-input>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="createButton.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="createButton.requestType" clearable placeholder="请求方式">
            <el-option
              v-for="(item,index) of _config.dict_method_type"
              :key="index"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属菜单">
          <el-cascader
            v-model="createButton.menuId"
            :props="prop"
            :show-all-levels="false"
            :options="menuTreeData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="是否公共资源">
          <el-select v-model="createButton.buttonType" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) of _config.dict_button_type"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="createButton.enabled"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showCreateButton = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </el-dialog>
    <!-- 查看按钮详情弹窗 -->
    <el-dialog :title="`按钮详情：${rowData.buttonName}`" :visible.sync="showButtonDetail">
      <el-form
        :disabled="checkType"
        :model="buttonDetail"
        size="mini"
        :label-width="formLabelWidth"
      >
        <el-form-item label="按钮名称">
          <el-input v-model="buttonDetail.buttonName"></el-input>
        </el-form-item>
        <el-form-item label="按钮代码">
          <el-input v-model="buttonDetail.buttonCode"></el-input>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="buttonDetail.url"></el-input>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="buttonDetail.requestType" clearable placeholder="请求方式">
            <el-option
              v-for="(item,index) of _config.dict_method_type"
              :key="index"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属菜单">
          <el-cascader
            v-model="buttonDetail.menuId"
            :props="prop"
            :show-all-levels="false"
            :options="menuTreeData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="是否公共资源">
          <el-select v-model="buttonDetail.buttonType" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) of _config.dict_button_type"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="buttonDetail.enabled"></el-switch>
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
        <el-button size="mini" @click="showButtonDetail = false">关闭</el-button>
        <el-button size="mini" v-show="!checkType" type="primary" @click="confirmChange">保存</el-button>
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
        checkType: true, //区分查看还是编辑
        rowData: "", //行数据
        nodeId: "", //菜单id
        showButtonDetail: false, //查看按钮详情弹窗
        showCreateButton: false, //创建按钮弹窗
        menuTreeData: [], //菜单树结构数据
        prop: {
          value: "id",
          label: "menuName",
          emitPath: false,
          checkStrictly: true
        },
        menuButtonDetail: [], //菜单按钮列表
        defaultProps: {
          // 菜单树结构字段
          children: "children",
          label: "menuName"
        },
        buttonDetail: {}, //按钮详情
        createButton: {
          //创建按钮信息
          buttonName: "",
          enabled: false,
          buttonCode: "",
          requestType: "",
          buttonType: 2,
          url: "",
          menuId: ""
        },
        formLabelWidth: "120px"
      };
    },
    mounted() {
      this.getMenuTree();
    },
    methods: {
      // 查看菜单绑定的按钮
      handleNodeClick(data) {
        this.getMenuButtonById(data.id);
        this.nodeId = data.id;
      },
      // 查询菜单按钮列表
      getMenuButtonById(id) {
        this.$request
          .get(this.$apiList.menu + "/" + id + "/buttons")
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              if (data.data != []) {
                var itemList = data.data;
                var len = itemList.length;
                for (var i = 0; i < len; i++) {
                  var obj = itemList[i];
                  this._config.dict_enabled_status.find(item => {
                    if (item.key == obj.enabled) {
                      obj.enabledVal = item.value;
                    }
                  });
                }
              }
              this.menuButtonDetail = data.data || [];
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查看按钮详情按钮
      handleCheck(index, row) {
        this.checkType = true;
        this.getButtonById(row.id);
        this.rowData = row;
        this.showButtonDetail = true;
      },
      // 删除'按钮'按钮
      handleDelete(index, row) {
        this.$confirm("此操作将永久删除该按钮, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.confirmDelete(row);
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      },
      // 确定删除按钮
      confirmDelete(row) {
        this.$request
          .delete(this.$apiList.button + "/" + row.id)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.getMenuButtonById(row.menuId);
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 创建按钮信息
      confirmCreate() {
        if (this.createButton.menuId == "") {
          this.$message("请选择所属菜单!");
          return;
        }
        this.$request
          .post(this.$apiList.button, this.createButton)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showCreateButton = false;
            this.createButton = this._funs.emptyObj(this.createButton);
            this.createButton.enabled = false;
            this.createButton.buttonType = 2;
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 确认修改按钮信息
      confirmChange() {
        this.$request.put(this.$apiList.button, this.buttonDetail).then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getMenuButtonById(this.nodeId);
          }
          this.showButtonDetail = false;
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
          .catch(error => {
            this.$message.error(error);
          });
      },
      // 查询按钮详情
      getButtonById(id) {
        this.$request
          .get(this.$apiList.button + "/" + id)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.buttonDetail = data.data || {};
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-tree {
    padding: 20px;
    padding-left: 0;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

