<template>
  <div>
    <!--<el-divider>{{$store.state.login.USER_INFO.realName}} 用户信息</el-divider>-->
    <div class="userCount">账户：{{$store.state.login.USER_INFO.username}}</div>
    <el-form label-width="80px" style="width: 540px;" size="mini" :model="userInfo" :rules="rules" ref="userInfos">
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model="userInfo.telephone" clearable placeholder="输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
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
      <el-form-item label="上次登录">
        <el-row>
          <el-col :span="9">IP：{{userInfo.ip}}</el-col>
          <el-col :span="15">时间：{{userInfo.time|formatTime('LLLL')}}</el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button type="primary" @click="submit">立即保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var confirmEmail = (rule, value, callback) => {
      const test = /^\w+@[A-Za-z\d]+\.([A-Za-z]{2,})$/g
      if (!test.test(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    var confirmPhone = (rule, value, callback) => {
      const test = /^1[3|4|5|7|8|9]\d{9}$/g
      if (!test.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    var confirmNewPas = (rule, value, callback) => {
      // 密码以字母数字_开头，且位数大于8位
      if (!(/\w{1,}[^a-zA-Z\d]+\w{6,}/.test(value))) {
        callback(new Error("密码格式以字母数字_开头，且位数在8-20之间"));
      } else {
        if (value.length>20){
          callback(new Error("新密码长度过长"));
        }else{
          callback();
        }
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
      },
      rules: {
        email:[{  validator: confirmEmail, trigger: 'change' }],
        telephone:[{  validator: confirmPhone, trigger: 'change' }],
        oldPassWord: [{ required: true, message: '请输入原密码', trigger: "blur" }],
        newPassWord: [{  validator: confirmNewPas, trigger: "blur" }],
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
          this.$message.success(res.data.msg);
          setTimeout(() => {
            this.$router.replace("/login");
            this._session.clearSession()
            this._session.clearLocalStorage()
          }, 300);
        })
    },
    // 立即提交按钮
    submit() {
      this.$refs['userInfos'].validate(valid => {
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

