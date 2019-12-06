<template>
  <div class="user">
    <el-row>
      <el-form inline :model="searchData" size="mini">
        <span>
          <el-form-item>
            <el-input v-model="searchData.username" clearable placeholder="登录账号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchData.realName" clearable placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchData.telephone" clearable placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchData.state" clearable placeholder="用户状态">
              <el-option
                v-for="(item,index) of _config.dict_user_status"
                :key="index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item>-->
          <!--<el-select v-model="searchData.userOrigin" clearable placeholder="用户来源">-->
          <!--<el-option-->
          <!--v-for="(item,index) of _config.dict_user_origin"-->
          <!--:key="index"-->
          <!--:label="item.value"-->
          <!--:value="item.key"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-select v-model="searchData.sex" clearable placeholder="性别">
              <el-option
                v-for="(item,index) of _config.dict_sex"
                :key="index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </span>
      </el-form>
      <el-form size="mini" inline>
        <el-form-item>
          <el-button type="primary" @click="getUserByPage(1)" icon="el-icon-search" v-show="buttonControl" v-buttonP="_config.buttonCode.B_LIST">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showCreateUser = true" icon="el-icon-plus" v-show="buttonControl" v-buttonP="_config.buttonCode.B_CREATE">创建用户</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 用户列表表格 -->
    <el-table size="mini" :data="userData.list" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="username" label="登录账号"></el-table-column>
      <el-table-column prop="realName" label="真实姓名"></el-table-column>
      <el-table-column prop="telephone" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="stateVal" label="用户状态"></el-table-column>
      <!--<el-table-column prop="userOriginVal" label="用户来源"></el-table-column>-->
      <el-table-column label="操作" width="420">
        <template v-slot="scope">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-view"
            @click="handleCheck(scope.$index, scope.row)"
          >详情
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-view"
            @click="handleCheckRole(scope.$index, scope.row)"
          >用户角色
          </el-button>
          <el-dropdown @command="e=>handleChangeState(e, scope.row)">
            <el-button
              type="danger"
              size="mini"
            >修改状态
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in _config.dict_user_status" :key="item.key+100" :command="item.key">
                {{item.value}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="handleChangePwd(scope.$index, scope.row)"
          >修改密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="showChangePwd">
      <el-form
        ref="changePwd"
        :rules="changePwdRule"
        :model="changePwdData"
        size="mini"
        :label-width="formLabelWidth"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="changePwdData.userName" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="changePwdData.password" show-password clearable placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input v-model="changePwdData.rePassword" show-password clearable placeholder="确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showChangePwd = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmChangePwd('changePwd')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 创建用户弹窗 -->
    <el-dialog title="创建用户" class="createuser" :visible.sync="showCreateUser" width="745px">
      <el-form
        :model="createUser"
        inline
        :rules="rules"
        ref="createUser"
        :label-width="formLabelWidth"
        size="mini"
      >
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="createUser.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="createUser.password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="createUser.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="createUser.telephone"></el-input>
        </el-form-item>
        <el-form-item label="所在部门" prop="deptIds">
          <el-cascader
            v-model="createUser.deptIds"
            :props="prop"
            @change="val=>createUser.deptIds = val "
            :show-all-levels="false"
            :options="deptTree"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="createUser.state" placeholder="请选择用户状态">
            <el-option
              v-for="(item,index) of _config.dict_user_status"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="createUser.email"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="createUser.idCard"></el-input>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="createUser.birthday"
            default-value="1990-01-01"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="createUser.sex" placeholder="请选择用户性别">
            <el-option
              v-for="(item,index) of _config.dict_sex"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="所在省">-->
          <!--<el-select v-model="createUser.provinceCode" filterable placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in provinceOptions"-->
              <!--:key="item.locationCode"-->
              <!--:label="item.locationName"-->
              <!--:value="item.locationCode">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="所在市">-->
          <!--<el-select v-model="createUser.cityCode" filterable placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in cityOptions"-->
              <!--:key="item.locationCode"-->
              <!--:label="item.locationName"-->
              <!--:value="item.locationCode">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="所在区/县">-->
          <!--<el-select v-model="createUser.districtCode" filterable placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in districtOptions"-->
              <!--:key="item.locationCode"-->
              <!--:label="item.locationName"-->
              <!--:value="item.locationCode">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="所在乡/镇/街道">-->
          <!--<el-select v-model="createUser.townCode" filterable placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in townOptions"-->
              <!--:key="item.locationCode"-->
              <!--:label="item.locationName"-->
              <!--:value="item.locationCode">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="所在村/小区">-->
          <!--<el-select v-model="createUser.villageCode" filterable placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in villageOptions"-->
              <!--:key="item.locationCode"-->
              <!--:label="item.locationName"-->
              <!--:value="item.locationCode">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="showCreateUser = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmCreate('createUser')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 查看用户角色详情弹窗 -->
    <el-dialog size="mini" :title="`用户角色列表：${rowData.username}`" :visible.sync="showUserRoleDetail" width="745px">
      <el-table size="mini" :data="userRoleDetail" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
      </el-table>
      <el-dialog
        width="725px"
        :title="`编辑用户角色：${rowData.username}`"
        append-to-body
        :visible.sync="showEditorUserRoleDetail"
      >
        <div style="text-align: center">
          <el-transfer
            style="text-align: left; display: inline-block"
            filterable
            :titles="['未拥有的角色', '已拥有的角色']"
            :button-texts="['到左边', '到右边']"
            :value="valueArr"
            :props="{
              key:'id',
              label:'name'
            }"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleRoleChange"
            :data="userRoleData"
          >
            <span slot-scope="{ option }">{{ option.name }}</span>
          </el-transfer>
        </div>
        <div slot="footer">
          <el-button size="mini" @click="showEditorUserRoleDetail = false">取消</el-button>
          <el-button size="mini" type="primary" @click="confirmChangeRole">确定</el-button>
        </div>
      </el-dialog>
      <div slot="footer">
        <el-button size="mini" @click="showUserRoleDetail = false">关闭</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="showEditorUserRoleDetail = true"
        >编辑用户角色
        </el-button>
      </div>
    </el-dialog>
    <!-- 查看用户详情弹窗 -->
    <el-scrollbar>
      <el-dialog :title="`用户详情：${rowData.username}`" class="createuser" :visible.sync="showUserDetail" width="745px">
        <el-form
          :disabled="checkType"
          :model="userDetail"
          inline
          size="mini"
          :label-width="formLabelWidth"
        >
          <el-form-item label="登录账号">
            <el-input v-model="userDetail.username"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="userDetail.realName"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userDetail.telephone"></el-input>
          </el-form-item>
          <el-form-item label="所在部门">
            <el-cascader
              v-model="userDetail.deptIds"
              :props="prop"
              @change="val=>userDetail.deptIds = val"
              :show-all-levels="false"
              :options="deptTree"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-select v-model="userDetail.state" placeholder="请选择用户状态">
              <el-option
                v-for="(item,index) of _config.dict_user_status"
                :key="index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userDetail.email"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="userDetail.idCard"></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker v-model="userDetail.birthday" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="userDetail.sex" placeholder="请选择用户性别">
              <el-option
                v-for="(item,index) of _config.dict_sex"
                :key="index"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="所在省">-->
            <!--<el-select v-model="userDetail.provinceCode" filterable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in provinceOptions"-->
                <!--:key="item.locationCode"-->
                <!--:label="item.locationName"-->
                <!--:value="item.locationCode">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="所在市">-->
            <!--<el-select v-model="userDetail.cityCode" filterable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in cityOptions"-->
                <!--:key="item.locationCode"-->
                <!--:label="item.locationName"-->
                <!--:value="item.locationCode">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="所在区/县">-->
            <!--<el-select v-model="userDetail.districtCode" filterable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in districtOptions"-->
                <!--:key="item.locationCode"-->
                <!--:label="item.locationName"-->
                <!--:value="item.locationCode">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="所在乡/镇/街道">-->
            <!--<el-select v-model="userDetail.townCode" filterable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in townOptions"-->
                <!--:key="item.locationCode"-->
                <!--:label="item.locationName"-->
                <!--:value="item.locationCode">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="所在村/小区">-->
            <!--<el-select v-model="userDetail.villageCode" filterable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in villageOptions"-->
                <!--:key="item.locationCode"-->
                <!--:label="item.locationName"-->
                <!--:value="item.locationCode">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        </el-form>
        <div slot="footer">
          <el-button
            size="mini"
            v-if="checkType"
            @click="checkType = false"
          >启用编辑
          </el-button>
          <el-button size="mini" v-else @click="checkType = true">关闭编辑</el-button>
          <el-button size="mini" @click="showUserDetail = false">关闭</el-button>
          <el-button size="mini" v-show="!checkType" type="primary" @click="confirmChange">保存</el-button>
        </div>
      </el-dialog>
    </el-scrollbar>
    <!-- 分页 -->
    <el-pagination
      background
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="userData.total"
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
        checkType: true, //区分是查看还是编辑
        rowIndex: "", //行索引
        rowData: "", //行数据
        userData: [], //用户列表数据
        searchData: {
          //用户列表查询条件
          pageNum: 1,
          pageSize: this._config.sizeArr[0],
          username: "",
          realName: "",
          telephone: "",
          idCard: "",
          state: "",
          userOrigin: ""
        },
        showCreateUser: false, //创建用户弹窗
        showUserDetail: false, //查看用户详情弹窗
        showUserRoleDetail: false, //查看用户角色弹窗
        showEditorUserRoleDetail: false, //编辑用户角色弹窗
        userDetail: {}, //用户详情
        userRoleDetail: [], //用户角色列表
        userNoRoleDetail: [], //用户未拥有角色列表
        valueArr: [],
        deptTree: [], //部门树结构
        prop: {
          value: "id",
          label: "name",
          emitPath: false,
          multiple: true,
          checkStrictly: true
        },
        createUser: {
          //创建用户信息
          birthday: "",
          cityName: "",
          districtCode: "",
          cityCode: "",
          provinceName:'',
          provinceCode: "",
          districtName: "",
          townCode:'',
          townName:'',
          villageCode:'',
          villageName:'',
          email: "",
          idCard: "",
          realName: "",
          sex: "",
          state: "",
          telephone: "",
          deptIds: "",
          username: "",
          password: ""
        }, //编辑用户表单数据
        formLabelWidth: "120px",
        rules: {
          //创建用户校验规则
          username: [
            {required: true, message: "请输入用户登录账号", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入用户登录密码", trigger: "blur"}
          ],
          realName: [
            {required: true, message: "请输入用户真实姓名", trigger: "blur"}
          ],
          deptIds: [
            {required: true, message: "请选择用户所在部门", trigger: "blur"}
          ],
          state: [{required: true, message: "请选择用户状态", trigger: "blur"}],
          telephone: [
            {required: true, message: "请输入用户手机号", trigger: "blur"},
            {
              min: 11,
              max: 11,
              message: "手机号必须为11位数字",
              trigger: "blur"
            }
          ]
        },
        changePwdRule: {
          //修改密码校验规则
          password: [
            {required: true, message: "请输入修改后的密码", trigger: "blur"}
          ],
          rePassword: [
            {required: true, message: "请确认修改后的密码", trigger: "blur"}
          ]
        },
        showChangePwd: false, //修改密码弹窗
        // 修改密码
        changePwdData: {
          password: "",
          rePassword: "",
          userName: ""
        }
      };
    },
    computed: {
      userRoleData() {
        //角色穿梭框中的数据
        var roleData = this.userRoleDetail; //已拥有角色
        var noRoleData = this.userNoRoleDetail; //未拥有角色
        var data = roleData.concat(noRoleData);
        var valArr = []; //目标列表中的数据项,值为原数据的key值,这里取的id
        var len = roleData.length;
        for (var i = 0; i < len; i++) {
          var item = roleData[i];
          valArr.push(item.id);
        }
        this.valueArr = valArr;
        console.log(data)
        return data;
      }
    },
    mounted() {
      this.getUserByPage();
      this.getDeptTree();
    },
    methods: {
      // 修改密码
      handleChangePwd(index, row) {
        this.showChangePwd = true;
        this.changePwdData.userName = row.username;
      },
      // 确认修改密码
      confirmChangePwd(ref) {
        this.$refs[ref].validate(valid => {
          if (valid) {
            if (this.changePwdData.password != this.changePwdData.rePassword) {
              this.$message("两次密码不一样，请重新输入！");
              return;
            }
            this.changePwdData.password = this._funs.Encrypt(
              this.changePwdData.password
            );
            this.changePwdData.rePassword = this._funs.Encrypt(
              this.changePwdData.rePassword
            );
            this.$request
              .put(`${this.$apiList.user}/password/anyone`, this.changePwdData)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.changePwdData = this._funs.emptyObj(this.changePwdData);
                this.showChangePwd = false;
              })
          } else {
            return false;
          }
        });
      },
      // 查询部门树
      getDeptTree() {
        this.$request
          .get(this.$apiList.dept + "/all/tree")
          .then(res => {
            var data = res.data;
            this.deptTree = data.data || [];
          })
      },
      // 角色穿梭框变化
      handleRoleChange(value, direction, movedKeys) {
        this.valueArr = value;
      },
      // 查看用户角色
      handleCheckRole(index, row) {
        this.$request.all([this.getUserRoleById(row), this.getUserNoRoleById(row)]).then(
          this.$request.spread((role, noRole) => {
            // 两个请求现在都执行完成
            if (role.data.code == 200) {
              this.userRoleDetail = role.data.data || [];
            }
            if (noRole.data.code == 200) {
              this.userNoRoleDetail = noRole.data.data || [];
            }
          })
        );
        this.rowIndex = index;
        this.rowData = row;
        this.showUserRoleDetail = true;
      },
      // 查询用户未拥有的角色详情
      getUserNoRoleById(row) {
        return this.$request.get(this.$apiList.user + "/other/roles", {
          params: {
            userId: row.id,
            name: row.username
          }
        });
      },
      // 查询用户角色详情
      getUserRoleById(row) {
        return this.$request.get(this.$apiList.user + "/" + row.id + "/roles");
      },
      // 确定编辑用户角色（穿梭框确定）
      confirmChangeRole() {
        this.$request
          .post(this.$apiList.user + "/roles", {
            userId: this.rowData.id,
            roleIds: this.valueArr.join()
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showEditorUserRoleDetail = false;
            this.showUserRoleDetail = false;
            this.handleCheckRole(this.rowIndex, this.rowData);
          })
      },
      // 查看用户详情按钮
      handleCheck(index, row) {
        this.checkType = true;
        this.getUserById(row.id);
        this.rowIndex = index;
        this.rowData = row;
        this.showUserDetail = true;
      },
      // 删除用户按钮
      handleChangeState(state, row) {
        this.$confirm("此操作将更改用户状态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.confirmState(row.id, state);
          })
      },
      // 更改用户状态用户
      confirmState(id, state) {
        this.$request
          .patch(this.$apiList.user + "/state", {
            id: id,
            state: state
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.handleCurrentChange();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 创建用户信息
      confirmCreate(createUser) {
        this.$refs[createUser].validate(valid => {
          if (valid) {
            //加密密码
            this.createUser.password = this._funs.Encrypt(
              this.createUser.password
            );
            this.$request
              .post(this.$apiList.user, this.createUser)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message.success(res.data.msg);
                }
                this.showCreateUser = false;
                this.createUser = this._funs.emptyObj(this.createUser);
                this.getUserByPage();
              })
          } else {
            return false;
          }
        });
      },
      // 确认修改用户信息
      confirmChange() {
        this.$request
          .put(this.$apiList.user, this.userDetail)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            }
            this.showUserDetail = false;
            this.getUserByPage();
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询用户详情
      getUserById(id) {
        this.$request
          .get(this.$apiList.user + "/" + id)
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.userDetail = data.data || {};
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 查询用户列表
      getUserByPage(val) {
        if (val) {
          this.searchData.pageNum = 1;
        }
        this.$request
          .get(this.$apiList.user, {
            params: this.searchData
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              if (data.data.list.length>0) {
                var itemList = data.data.list;
                var len = itemList.length;
                // 员工状态
                for (var i = 0; i < len; i++) {
                  var obj = itemList[i];
                  this._config.dict_user_status.find(item => {
                    if (item.key == obj.state) {
                      obj.stateVal = item.value;
                    }
                  });
                  this._config.dict_user_origin.find(item => {
                    if (item.key == obj.userOrigin) {
                      obj.userOriginVal = item.value;
                    }
                  });
                }
              }
              this.userData = data.data || [];
            }
          })
          .catch(err => {
            this.$message.error(err);
          });
      },
      // 翻页
      handleCurrentChange(val) {
        this.searchData.pageNum = val;
        this.getUserByPage();
      },
      // 修改每页显示数量
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.getUserByPage();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .user {
    & /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background: #409eff !important;
      border-color: #409eff !important;
    }
    & /deep/ .el-tree {
      width: 200px;
    }
    & /deep/ .el-checkbox:last-child {
      margin-right: 30px;
    }
    .createuser {
      & /deep/ .el-input__inner, .el-input {
        width: 180px;
      }
    }
  }
</style>

