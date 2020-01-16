<template>
  <el-form :model="data" :rules="rules" ref="formRules">
    <el-form-item prop="username">
      <div class="inputContent">
        <lee-icon icon="iconyonghu"></lee-icon>
        <el-input v-model="data.username" placeholder="请输入用户名" class="trans" clearable></el-input>
      </div>
    </el-form-item>
    <el-form-item prop="password">
      <div class="inputContent">
        <lee-icon icon="iconsuo"></lee-icon>
        <el-input type="password" v-model="data.password" placeholder="请输入密码" class="trans" clearable></el-input>
      </div>
    </el-form-item>
    <el-form-item>
      <slider :control="control" @change="val => control=val"></slider>
    </el-form-item>
    <!--<el-form-item>-->
      <!--<el-checkbox v-model="checked">记住密码</el-checkbox>-->
      <!--<el-link class="passBack">忘记密码？</el-link>-->
    <!--</el-form-item>-->
    <el-form-item>
      <el-button type="primary" class="login" @click="login" @keyup.enter.native="login">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  const Slider = () => import('@/components/checking/slider')
  const leeIcon = () => import('@/components/icon/index')
  export default {
    name: "info-login",
    components: {
      Slider,
      leeIcon
    },
    data() {
      return {
        checked: '',
        control: false,//
        data: {
          username: '',
          password: ''
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        }
      }
    },
    methods: {
      login() {
        this.$refs['formRules'].validate(valid => {
          if (valid) {
            if (!this.control) {
              this.$message.error('请拖动滑块')
              return
            }
            const params = {
              username: this.data.username,
              password: this._funs.Encrypt(this.data.password)
            }
            this.$store.dispatch('Login', params).then(res => {
              this.$router.replace('/index')
            })
            //接口有反应后，初始化滑块状态
            this.control = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .trans {
    & /deep/ .el-input__inner {
      padding-left: 43px;
    }
  }
  /deep/ .el-form-item__content{
    line-height: 20px;
  }
  /deep/ .el-button {
    width: 100%;
  }

  /deep/ .el-form-item__error {
    color: $white;
  }

  .passBack {
    height: 25px;
  }
</style>
