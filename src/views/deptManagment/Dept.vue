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
    <el-col style="background:#fff;">
      <el-col :span="12">
        <!-- 部门树结构 -->
        <el-tree :data="deptTree" default-expand-all :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="custom-tree-node-title">{{ node.label }}</span>
            <span>
              <span
                v-if="!data.dingSync"
                @click.stop="syncToDing(data)"
              >
                <el-button type="primary" size="mini">同步到钉钉</el-button>
              </span>
              <el-button
                size="mini"
                @click.stop="handleNodeClick(data)"
              >查看详情</el-button>
              <el-button
                size="mini"
                @click.stop="handleCreate(data)"
              >添加子部门</el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="12">
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
  </div>
</template>

<script>
  import mixin from '@/mixin/buttonPermission'

  export default {
    mixins: [mixin],
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
        }
      };
    },
    mounted() {
      this.getDeptTree();
    },
    methods: {
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
          .get(this.$apiList.dept + "/treeview?isAdmin=true")
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

