<template>
  <div>
    <div class="dept">
      <!-- 添加子部门输入部门名称弹窗 -->
      <el-dialog :title="`您将在 ${parentData.locationName} 下${dragControl?'添加':'编辑'}${childInfo}`"
                 :visible.sync="showInputDeptName" width="670px">
        <el-form :model="createData" size="mini" inline label-width="120px">
          <el-form-item label="地区名称">
            <el-input v-model="createData.locationName" clearable placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="名称全拼">
            <el-input v-model="createData.fullLetter" clearable placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="首字母">
            <el-input v-model="createData.firstLetter" clearable placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="位置编号">
            <el-input v-model="createData.locationCode" clearable placeholder="请输入位置编号"></el-input>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-switch
              v-model="createData.disabled"
              active-color="#13ce66"
              @change="val => createData.disabled = val"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="showInputDeptName = false">取消</el-button>
          <el-button size="mini" type="primary" @click="confirmCreate">确定</el-button>
        </div>
      </el-dialog>
      <el-row v-if="deptTree.length>0">
        <el-form inline>
          <el-form-item label="请输入省/市/区/乡/村关键字:">
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
          <span class="custom-tree-node" slot-scope="{ node, data }"
                @click.stop="() => handleNodeClick(data)"
          >
             <el-tooltip class="item" effect="dark" :content="node.label" placement="top">
              <span class="custom-tree-node-title">{{ node.label }}</span>
             </el-tooltip>
            <!---->
            <span style="min-width:360px;text-align: left;">
              <el-button
                size="mini"
                type="primary"
                :style="`visibility: ${data.locationType !='village'?'visible':'hidden'};`"
                icon="el-icon-plus"
                @click.stop="handleCreate(data)"
              >添加{{formatType(data)}}</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click.stop="handleEdit(data)"
              >修改</el-button>
              <el-button
                size="mini"
                :type="data.disabled?'warning':'success'"
                :icon="data.disabled?'el-icon-close':'el-icon-check'"
                @click.stop="handleForbidden(data)"
              >{{data.disabled?'禁用中':'启用中'}}</el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="data.locationType!='province'"
                icon="el-icon-delete"
                @click.stop="handleDelete(data)"
              >删除</el-button>
            </span>
          </span>
          </el-tree>
        </el-col>
      </el-col>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixin/buttonPermission'
  import treeMixin from '@/mixin/treeSearchMixin'

  export default {
    mixins: [mixin, treeMixin],
    name: "add-address",
    data() {
      return {
        defaultProps: {
          // 地址树结构字段
          children: "children",
          label: "locationName",
        },
        createData: {
          disabled: false,//启用/禁用
          firstLetter: "",//首字母
          fullLetter: "",//全字母
          locationCode: "",//位置编码
          locationName: "",//名称
          locationParentCode: "",//父级编码
          locationType: ''//
        },
        deptTree: [],//树数据源
        showInputDeptName: false,//添加编辑信息弹框
        parentData: {},//点击树对应的数据
        childInfo: '',
        dragControl: true,//控制编辑和添加
      }
    },
    created() {
      this.getProvice()
    },
    methods: {
      //信息转换中文
      formatType(val) {
        // const test = /(重庆)|(天津)|(北京)|(上海)/
        // let i = test.test(val.locationName)
        switch (val.locationType) {
          //通过省查市
          case 'province':
            return '市'
            break;
          //通过市查县/区
          case 'city':
            return '区'
            break;
          //通过县/区查乡镇
          case 'district':
            return '乡'
            break;
          //通过乡镇查村
          case 'town':
            return '村'
            break;
          case 'village':
            return '户'
            break;
        }
      },
      //转换添加的type
      formatBeType(val) {
        switch (val) {
          //通过省查市
          case 'province':
            return 'city'
            break;
          //通过市查县/区
          case 'city':
            return 'district'
            break;
          //通过县/区查乡镇
          case 'district':
            return 'town'
            break;
          //通过乡镇查村
          case 'town':
            return 'village'
            break;
        }
      },
      //添加children 属性
      formatTree(data) {
        return data.map(item => {
          item.children = []
          return item
        })
      },
      //查询对应数据
      handleNodeClick(data) {
        let code = data.locationCode
        this.parentData = data
        switch (data.locationType) {
          //通过省查市
          case 'province':
            this.getCity(code, data)
            break;
          //通过市查县/区
          case 'city':
            this.getStrict(code, data)
            break;
          //通过县/区查乡镇
          case 'district':
            this.getTown(code, data)
            break;
          //通过乡镇查村
          case 'town':
            this.getVillage(code, data)
            break;
        }
      },
      //获取所有省的数据
      getProvice() {
        this.$request.get(`${this.$apiList.location}/province/all`).then(res => {
          this.deptTree = this.formatTree(res.data.data)
        })
      },
      //获取市数据
      getCity(code, data) {
        this.$request.get(`${this.$apiList.location}/province/${code}/city/all`).then(res => {
          data.children = this.formatTree(res.data.data)
        })
      },
      //获取县/区数据
      getStrict(code, data) {
        this.$request.get(`${this.$apiList.location}/province/city/${code}/district/all`).then(res => {
          data.children = this.formatTree(res.data.data)
        })
      },
      //获取乡镇数据
      getTown(code, data) {
        this.$request.get(`${this.$apiList.location}/province/city/district/${code}/town/all`).then(res => {
          data.children = this.formatTree(res.data.data)
        })
      },
      //获取村数据
      getVillage(code, data) {
        this.$request.get(`${this.$apiList.location}/province/city/district/town/${code}/village/all`).then(res => {
          data.children = this.formatTree(res.data.data)
        })
      },
      // 点击添加子信息
      handleCreate(data) {
        this.dragControl = true
        this.parentData = data;
        this.childInfo = this.formatType(data)
        this.showInputDeptName = true;
        this.createData.disabled = true
        this.createData.locationParentCode = data.locationCode;
      },
      //修改信息
      handleEdit(data) {
        this.dragControl = false
        this.parentData = data;
        this.createData = data
        this.childInfo = ''
        this.showInputDeptName = true;
      },
      //快捷禁/启用省市区镇村
      handleForbidden(data) {
        this.$confirm(`确定要${data.disabled ? '启用' : '禁用'}${data.locationName}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            data.disabled ? data.disabled = false : data.disabled = true
            this.$request
              .put(this.$apiList.location, data)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.handleNodeClick(this.parentData)
              })
          })
          .catch(() => {
            this.$message("已取消");
          });
      },
      //删除市/区等
      handleDelete(data) {
        this.$confirm(`确定要移除${data.locationName}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$request
              .delete(`${this.$apiList.location}/${data.locationCode}`)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.handleNodeClick(this.parentData)
              })
          })
          .catch(() => {
            this.$message("已取消");
          });
      },
      // 创建/修改省市区镇村
      confirmCreate() {
        if (this.createData.locationName == "") {
          this.$message("请输入名称");
          return;
        }
        // this.dragControl=true的时候创建
        this.dragControl ? this.createData.locationType = this.formatBeType(this.parentData.locationType) : ''
        this.$request[(this.dragControl ? 'post' : 'put')](this.$apiList.location, this.createData)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showInputDeptName = false;
            this.createData = {
              disabled: true,//启用/禁用
              firstLetter: "",//首字母
              fullLetter: "",//全字母
              locationCode: "",//位置编码
              locationName: "",//名称
              locationParentCode: "",//父级编码
              locationType: this.childInfo || ''//
            }
            //完事更新数据
            this.dragControl?this.handleNodeClick(this.parentData):''
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
    }
  }
</script>

<style scoped>

</style>
