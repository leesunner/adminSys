<template>
  <div class="dept">
    <!-- 添加子部门输入部门名称弹窗 -->
    <el-dialog :title="`您将在《${parentDeptName}》下添加下级机构`" :visible.sync="showInputDeptName" width="715px">
      <el-form :model="createInfo" size="mini" label-width="120px" inline :rules="DeptRules" ref="DeptRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="createInfo.name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="createInfo.code" clearable placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="createInfo.level" @change="changeLevel" filterable placeholder="请选择">
            <el-option
              v-for="item in levelOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省">
          <el-select v-model="createInfo.provinceCode" :disabled="createInfo.level<2" @change="getCityByProvice"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in provinceOptions"
              :key="item.locationCode"
              :label="item.locationName"
              :value="item.locationCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市">
          <el-select v-model="createInfo.cityCode" :disabled="createInfo.level<3" @change="getDistrictByCity"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in cityOptions"
              :key="item.locationCode"
              :label="item.locationName"
              :value="item.locationCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区(县)">
          <el-select v-model="createInfo.districtCode" :disabled="createInfo.level<4" @change="getTownByDistrict"
                     filterable placeholder="请选择">
            <el-option
              v-for="item in districtOptions"
              :key="item.locationCode"
              :label="item.locationName"
              :value="item.locationCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="街道(乡镇)">
          <el-select v-model="createInfo.townCode" :disabled="createInfo.level<5" @change="getVillageByTown" filterable
                     placeholder="请选择">
            <el-option
              v-for="item in townOptions"
              :key="item.locationCode"
              :label="item.locationName"
              :value="item.locationCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小区(村)">
          <el-select v-model="createInfo.villageCode" :disabled="createInfo.level<6" filterable placeholder="请选择">
            <el-option
              v-for="item in villageOptions"
              :key="item.locationCode"
              :label="item.locationName"
              :value="item.locationCode">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showInputDeptName = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmCreate">确定</el-button>
      </div>
    </el-dialog>
    <el-row>
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
    <el-row style="background:#fff;">
      <el-col :span="14">
        <!-- 部门树结构 -->
        <el-tree :data="deptTree"
                 class="filter-tree"
                 :filter-node-method="filterNode"
                 ref="tree" :accordion="true"
                 :default-expanded-keys="expandedKeys"
                 node-key="id"
                 accordion
                 :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }" @click.stop.prevent="handleNodeClick(data)">
            <el-tooltip class="item" effect="dark" :content="node.label" placement="right">
              <span class="custom-tree-node-title">{{ node.label }}</span>
            </el-tooltip>
            <span style="width:392px;text-align: left;">
              <!--<span-->
              <!--v-if="!data.dingSync"-->
              <!--@click.stop="syncToDing(data)"-->
              <!--&gt;-->
              <!--<el-button type="primary" size="mini">同步到钉钉</el-button>-->
              <!--</span>-->
              <el-button
                :type="detailInfo.id==data.id?'primary':''"
                icon="el-icon-view"
                size="mini"
                @click.stop="handleNodeClick(data)"
                v-if="buttonControl[_config.buttonCode.B_DETAIL]"
              >详情</el-button>
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-plus"
                v-if="buttonControl[_config.buttonCode.B_CREATE]"
                @click.stop="handleCreate(data)"
              >添加子机构</el-button>
              <!--暂时不启用-->
              <el-dropdown @command="e=>handleCheckButton(e, data)"
                           v-if="buttonControl[_config.buttonCode.B_DEPT_ROLE_LIST]||buttonControl[_config.buttonCode.B_DEPT_USER_LIST]">
                <el-button
                  type="primary"
                  size="mini"
                  @click.stop="()=>{}"
                >查询按钮
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <!--<el-dropdown-item :command="1" v-if="buttonControl[_config.buttonCode.B_DEPT_ROLE_LIST]">-->
                  <!--查询角色-->
                  <!--</el-dropdown-item>-->
                  <el-dropdown-item :command="2" v-if="buttonControl[_config.buttonCode.B_DEPT_USER_LIST]">
                    查询用户
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                size="mini"
                :type="data.enabled?'success':'danger'"
                :icon="data.enabled?'el-icon-view':'el-icon-minus'"
                v-if="buttonControl[_config.buttonCode.B_STATUS]"
                @click.stop="handleChangeStatus(data)"
              >{{data.enabled?'已启用':'已禁用'}}</el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="10" v-show="detailInfo.id" style="padding-left: 15px;">
        <!-- 部门详情 -->
        <el-form
          :model="detailInfo"
          size="mini"
          inline
          ref="DeptDetailRules"
          :rules="DeptRules"
          :disabled="checkType"
          label-width="90px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="detailInfo.name"></el-input>
          </el-form-item>
          <!--<el-form-item label="部门类型">-->
          <!--<el-select style="width:100%;" v-model="detailInfo.type" clearable placeholder="部门类型">-->
          <!--<el-option-->
          <!--v-for="(item,index) of _config.dict_dept_type"-->
          <!--:key="index"-->
          <!--:label="item.value"-->
          <!--:value="item.key"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="编码" prop="code">
            <el-input v-model="detailInfo.code"></el-input>
          </el-form-item>
          <el-form-item label="级别" prop="level">
            <el-select v-model="detailInfo.level" @change="changeLevel" filterable placeholder="请选择">
              <el-option
                v-for="item in levelOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属机构">
            <el-cascader
              v-model="detailInfo.pid"
              :props="prop"
              :show-all-levels="false"
              :options="deptTree"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="省" prop="provinceCode">
            <el-select v-model="detailInfo.provinceCode"
                       @change="getCityByProvice"
                       :disabled="detailInfo.level<2"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in provinceOptions"
                :key="item.locationCode"
                :label="item.locationName"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="cityCode">
            <el-select v-model="detailInfo.cityCode" :disabled="detailInfo.level<3" @change="getDistrictByCity"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in cityOptions"
                :key="item.locationCode"
                :label="item.locationName"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区(县)" prop="districtCode">
            <el-select v-model="detailInfo.districtCode" :disabled="detailInfo.level<4" @change="getTownByDistrict"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in districtOptions"
                :key="item.locationCode"
                :label="item.locationName"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="街道(乡镇)" prop="townCode">
            <el-select v-model="detailInfo.townCode" @change="getVillageByTown" :disabled="detailInfo.level<5"
                       filterable placeholder="请选择">
              <el-option
                v-for="item in townOptions"
                :key="item.locationCode"
                :label="item.locationName"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小区(村)" prop="villageCode">
            <el-select v-model="detailInfo.villageCode" :disabled="detailInfo.level<6" filterable placeholder="请选择">
              <el-option
                v-for="item in villageOptions"
                :key="item.locationCode"
                :label="item.locationName"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="detailInfo.enabled"></el-switch>
            <p style="color:#E6A23C">“禁用”后此机构将不可用</p>
          </el-form-item>
        </el-form>
        <el-form label-width="100px">
          <el-form-item size="mini">
            <el-button
              @click="checkType = false"
              v-if="checkType&&buttonControl[_config.buttonCode.B_UPDATE]"
            >启用编辑
            </el-button>
            <el-button v-else @click="checkType = true">关闭编辑</el-button>
            <el-button v-show="!checkType" type="primary" @click="confirmChange">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 查看角色列表弹窗 -->
    <el-dialog :title="`角色列表：${rowData.name}`" :visible.sync="dialogTableRoleVisible" width="715px">
      <el-table :data="userGroupRoleDetail.list"
                size="mini"
                ref="multipleTable"
                border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="角色名"></el-table-column>
        <el-table-column label="操作" width="90">
          <template v-slot="scope">
            <el-button type="danger"
                       size="mini"
                       v-if="checkType&&buttonControl[_config.buttonCode.B_DELETE_ROLE]"
                       @click="handleDelRole(scope.$index, scope.row)">移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="`添加角色：${rowData.name}`"
        append-to-body
        width="715px"
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
          v-if="buttonControl[_config.buttonCode.B_INTO_DEPT_ROLE]"
          @click="handleAddRole"
        >添加角色
        </el-button>
      </div>
    </el-dialog>
    <!-- 查看用户组成员列表弹窗 -->
    <el-dialog :title="`成员列表：${rowData.name}`" :visible.sync="showUserGroupMemberDetail" width="815px">
      <el-form inline size="mini" :model="userSearchData">
        <span class="searchInfo">
          <el-form-item>
            <el-input v-model="userSearchData.keyword" clearable placeholder="可输入账号、手机号、真实姓名查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUserGroupMemberById"
                       v-if="buttonControl[_config.buttonCode.B_UNOWN_USER_LIST]">查询</el-button>
          </el-form-item>
        </span>
      </el-form>
      <el-table :data="userGroupMemberDetail.list || []" size="mini" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="username" label="账号名" width="105px"></el-table-column>
        <el-table-column prop="realName" label="真实名" width="105px"></el-table-column>
        <el-table-column prop="telephone" label="手机号" width="105px"></el-table-column>
        <el-table-column prop="telephone" label="角色信息">
          <template v-slot="scope">
            <p v-for="item in scope.row.roleList" v-if="scope.row.roleList">{{`${item.roleName}：${item.roleCode}`}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template v-slot="scope">
            <el-button type="danger"
                       size="mini"
                       v-if="buttonControl[_config.buttonCode.B_DELETE_USERS]"
                       @click="handleDelMember(scope.$index, scope.row)">移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="715px"
        :title="`添加成员：${rowData.name}`"
        append-to-body
        :visible.sync="showEditorUserGroupMemberDetail"
      >
        <el-form inline size="mini" :model="userSearchData">
        <span class="searchInfo">
          <el-form-item>
            <el-input v-model="searchUserNoMember.keyword" clearable placeholder="可输入账号、手机号、真实姓名查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUserGroupNoMemberById"
                       v-if="buttonControl[_config.buttonCode.B_INTO_DEPT_USERS]">查询</el-button>
          </el-form-item>
        </span>
        </el-form>
        <el-table
          ref="noMemberTable"
          row-key="id"
          :data="userGroupNoMemberDetail.list || []"
          style="width: 100%"
          border
          size="mini"
          @selection-change="handleSelectionMemberChange"
        >
          <el-table-column type="selection" reserve-selection width="55"></el-table-column>
          <el-table-column prop="username" label="账号名"></el-table-column>
          <el-table-column prop="realName" label="真实名"></el-table-column>
          <el-table-column prop="telephone" label="手机号"></el-table-column>
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
          v-if="buttonControl[_config.buttonCode.B_INTO_DEPT_USERS]"
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
  import addressMixin from '@/mixin/addressMixin'

  export default {
    mixins: [mixin, treeMixin, addressMixin],
    name: "dept",
    data() {
      return {
        expandedKeys: [],
        checkType: true, //区分查看还是编辑
        detailInfo: {}, //部门详情
        deptTree: [], //部门树结构
        prop: {
          value: "id",
          label: "name",
          emitPath: false,
          checkStrictly: true
        },
        levelOptions: [],
        createInfo: {
          description: "",
          name: "",
          level: '',
          code: '',
          cityName: "",
          districtCode: "",
          cityCode: "",
          provinceName: '',
          provinceCode: "",
          districtName: "",
          townCode: '',
          townName: '',
          villageCode: '',
          villageName: '',
        }, //新增部门
        DeptRules: {
          name: [{required: true, message: '请输入机构名', trigger: 'blur'}],
          code: [{required: true, message: '请输入机构编码', trigger: 'blur'}],
          level: [{required: true, message: '请选择级别', trigger: 'blur'}],
        },
        showInputDeptName: false, //添加子部门弹窗
        parentDeptName: "", //父部门名称
        defaultProps: {
          // 部门树结构字段
          children: "children",
          label: "name"
        },
        selectRoleArr: [], //选中的角色
        userGroupRoleDetail: {},//部门拥有的角色列表
        dialogTableRoleVisible: false,//部门拥有的角色列表弹框
        rowData: {},//行信息
        showEditorUserGroupRoleDetail: false,//添加角色弹框
        userGroupNoRoleDetail: {},
        searchUserRole: {
          //用户组有角色查询
          deptId: "",
          roleName: '',
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
          keyword: "",
          deptId: '',
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
          keyword: '',
          pageSize: this._config.sizeArr[0]
        },
        selectMemberArr: [], //选中的成员
      };
    },
    mounted() {
      this.getDeptTree();
      this.getLevelOptions();
      this.getAllRequest()
    },
    methods: {
      //清空地址
      changeLevel(){
        this.createInfo.provinceCode = ''
        this.createInfo.cityCode = ''
        this.createInfo.districtCode = ''
        this.createInfo.townCode = ''
        this.createInfo.villageCode = ''
      },
      //获取部门级别
      getLevelOptions() {
        this.$request.get(`${this.$apiList.dept}/level`).then(res => {
          this.levelOptions = res.data.data || []
        })
      },
      getAllRequest() {
        this.$request.all([this.getAlreadyProvice()]).then(this.$request.spread((res1) => {
          this.provinceOptions = res1.data.data || []
        }))
      },
      // 查看权限拥有的按钮
      handleCheckButton(type, data) {
        if (type == 1) {
          this.handleCreateRole(data)
        } else {
          this.handleCheckMember(data)
        }
      },
      //启用禁用
      handleChangeStatus(data) {
        this.$confirm(`此操作将${data.enabled ? '禁用' : '启用'}该机构及其下属机构, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let obj = {
              id: data.id,
              enable: !data.enabled
            }
            this.$request.put(`${this.$apiList.dept}/enable`, obj).then(res => {
              this.$message.success(res.data.msg);
              this.getDeptTree();
            })
          })
          .catch(() => {
            this.$message("已取消");
          });
      },
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
          .get(this.$apiList.dept + "/roles", {
            params: this.searchUserRole
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
        if (typeof id !== 'object') {
          this.userSearchData.deptId = id
        }
        this.$request
          .get(this.$apiList.dept + `/users`, {
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
        this.rowData = data
        this.expandedKeys = [data.id]
        this.getDeptById(data.id);
      },
      // 点击添加子部门
      handleCreate(data) {
        this.rowData = data
        this.parentDeptName = data.name;
        this.showInputDeptName = true;
        this.createInfo.pid = data.id;
        this.expandedKeys = [data.id]
      },
      // 创建部门
      confirmCreate() {
        this.$refs['DeptRules'].validate(valid => {
          if (valid) {
            let level = this.createInfo.level
            if (level == 2 && this.createInfo.provinceCode == '') {
              this.$message.error('请选择可用的地址')
              return
            }
            if (level == 3 && (this.createInfo.provinceCode == '' || this.createInfo.cityCode == '')) {
              this.$message.error('请选择可用的地址')
              return
            }
            if (level == 4 && (this.createInfo.provinceCode == '' || this.createInfo.cityCode == ''|| this.createInfo.districtCode == '')) {
              this.$message.error('请选择可用的地址')
              return
            }
            if (level == 5 && (this.createInfo.provinceCode == '' || this.createInfo.cityCode == '' || this.createInfo.districtCode == '' || this.createInfo.townCode == '')) {
              this.$message.error('请选择可用的地址')
              return
            }
            if (level == 6 && (this.createInfo.provinceCode == '' || this.createInfo.cityCode == '' || this.createInfo.districtCode == '' || this.createInfo.townCode == '' ||this.createInfo.villageCode == '')) {
              this.$message.error('请选择可用的地址')
              return
            }
            let data = this.formatFormDatas(this.createInfo)
            this.$request.post(this.$apiList.dept, data)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.showInputDeptName = false;
                this.createInfo = this._funs.emptyObj(this.createInfo);
                this.createInfo.level = ''
                this.getDeptTree();
              })
          }
        })
      },
      // 确认修改部门信息
      confirmChange() {
        this.$refs['DeptDetailRules'].validate(valid => {
          if (valid) {
            let level = this.detailInfo.level
            if (level == 2 && this.detailInfo.provinceCode == '') {
              this.$message.error('请选择可用的地址')
              return
            }
            if (level == 3 && (this.detailInfo.provinceCode == '' || this.detailInfo.cityCode == '')) {
              this.$message.error('请选择可用的地址')
              return
            }
            if (level == 4 && (this.detailInfo.provinceCode == '' || this.detailInfo.cityCode == ''|| this.detailInfo.districtCode == '')) {
              this.$message.error('请选择可用的地址')
              return
            }
            if (level == 5 && (this.detailInfo.provinceCode == '' || this.detailInfo.cityCode == '' || this.detailInfo.districtCode == '' || this.detailInfo.townCode == '')) {
              this.$message.error('请选择可用的地址')
              return
            }
            if (level == 6 && (this.detailInfo.provinceCode == '' || this.detailInfo.cityCode == '' || this.detailInfo.districtCode == '' || this.detailInfo.townCode == '' ||this.detailInfo.villageCode == '')) {
              this.$message.error('请选择可用的地址')
              return
            }
            let data = this.formatFormDatas(this.detailInfo)
            this.$request
              .put(this.$apiList.dept, data)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.detailInfo = this._funs.emptyObj(this.detailInfo);
                this.checkType = true;
                this.getDeptTree();
              })
              .catch(err => {
                this.$message.error(err);
              });
          }
        })
      },
      // 查询部门详情
      getDeptById(id) {
        this.$request
          .get(this.$apiList.dept + "/" + id)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.detailInfo = data.data || {};
              this.getAddressInfoByDetail(this.detailInfo)
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
              this.handleNodeClick(this.expandedKeys.length <= 0 ? data.data[0] : this.rowData)
            }
          })
      }
    }
  };
</script>
<style lang="scss" scoped>
  .dept {
    & /deep/ .el-form-item__content {
      width: 193px;
    }
  }

  .searchInfo {
    & /deep/ .el-form-item__content {
      width: 250px;
    }
  }
</style>

