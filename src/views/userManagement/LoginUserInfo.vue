<template>
  <div>
    <el-divider>{{$store.state.login.USER_INFO.realName}} 用户信息</el-divider>
    <div class="userCount">账户：{{$store.state.login.USER_INFO.username}}</div>
    <el-form label-width="80px" style="width: 540px;" size="mini" :model="userInfo" :rules="rules" ref="userInfo">
      <el-form-item label="用户名">
        <el-input v-model="userInfo.userName" disabled placeholder="输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="userName">
        <el-input v-model="userInfo.roleName" disabled placeholder="输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="userName">
        <el-input v-model="userInfo.telephone" clearable placeholder="输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="userName">
        <el-input v-model="userInfo.email" clearable placeholder="输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="原密码" prop="oldPassWord">
        <el-input type="password" v-model="userInfo.oldPassWord" clearable placeholder="输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassWord">
        <el-input type="password" v-model="userInfo.newPassWord" clearable placeholder="输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassWord">
        <el-input type="password" v-model="userInfo.confirmPassWord" clearable placeholder="再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <p>此账号仅可用于查看内容相关信息</p>
      </el-form-item>
      <el-form-item label="上次登录">
        <el-row>
          <el-col :span="11">IP：{{userInfo.ip}}</el-col>
          <el-col :span="13">时间：{{userInfo.time|formatTime('LLLL')}}</el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button @click="submit('changePwd')" type="primary">立即保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var oldPassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        if (this.userInfo.newPassWord !== "") {
          this.$refs.userInfo.validateField("newPassWord");
        }
        callback();
      }
    };
    var newPassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.userInfo.confirmPassWord !== "") {
          this.$refs.userInfo.validateField("confirmPassWord");
        }
        callback();
      }
    };
    var confirmPassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (
        value !== this.userInfo.newPassWord &&
        this.userInfo.newPassWord != ""
      ) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userId: this.$store.state.login.USER_INFO.id, //用户id
      userInfo: {
        oldPassWord: "",
        newPassWord: "",
        telephone:this.$store.state.login.USER_INFO.telephone,
        email:this.$store.state.login.USER_INFO.email,
        confirmPassWord:'',
        userName:this.$store.state.login.USER_INFO.username,
        ip:this.$store.state.login.USER_INFO.lastLoginIp,
        time:this.$store.state.login.USER_INFO.lastLoginDate,
        roleName:this.$store.state.login.USER_INFO.roleName,
      },
      rules: {
        email:[{ required: true, message: '请输入邮箱', trigger: 'change' }],
        telephone:[{ required: true, message: '请输入手机号码', trigger: 'change' }],
        oldPassWord: [{ validator: oldPassWord, trigger: "blur" }],
        newPassWord: [{ validator: newPassWord, trigger: "blur" }],
        confirmPassWord: [{ validator: confirmPassWord, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 修改密码请求
    confirmChange() {
      this.$request
        .patch(this.$apiList.account, {
          id: this.userId,
          newPassword: this._funs.Encrypt(this.userInfo.confirmPassWord),
          oldPassword: this._funs.Encrypt(this.userInfo.oldPassWord),
          telephone:this.userInfo.telephone,
          email:this.userInfo.email,
        })
        .then(res => {
          // 跳转登录
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            setTimeout(() => {
              this.$router.replace("/login");
            }, 300);
          }
        })
    },
    // 立即提交按钮
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.confirmChange();
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-divider__text,
.el-link {
  font-size: 18px;
}
.userCount {
  height: 50px;
  line-height: 50px;
  background: #f2f2f2;
  border-left: 5px solid #409EFF;
  font-size: 14px;
  padding-left: 30px;
}
.el-form {
  width: 430px;
  margin: 70px auto;
}
</style>

