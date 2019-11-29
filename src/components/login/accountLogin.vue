<template>
  <el-form ref="form" :model="data">
    <el-form-item>
      <el-form-item>
        <div class="inputContent">
         <lee-icon icon="iconyonghu"></lee-icon>
          <el-input v-model="data.username" placeholder="请输入用户名" class="trans" clearable></el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="inputContent">
          <lee-icon icon="iconsuo"></lee-icon>
          <el-input type="password" v-model="data.password" placeholder="请输入密码" class="trans" clearable></el-input>
        </div>
      </el-form-item>
      <slider></slider>
      <el-form-item>
        <el-checkbox v-model="checked">记住密码</el-checkbox>
        <el-link class="passBack">忘记密码？</el-link>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login" @click="login" @keyup.enter.native="login">登 录</el-button>
      </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
  const Slider = () => import('@/components/checking/slider')
  const leeIcon = () => import('@/components/icon/index')
  import {Encrypt} from '@/tools/utilTools'

  export default {
    name: "info-login",
    components: {
      Slider,
      leeIcon
    },
    data() {
      return {
        checked: '',
        data: {
          username: '',
          password: ''
        },
      }
    },
    methods: {
      checkInfo() {

      },
      login() {
        const params = {
          username: this.data.username,
          password: Encrypt(this.data.password)
        }
        this.$store.dispatch('Login', params).then(res => {
          this.$router.push('index')
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
  .passBack {
    height: 25px;
  }

  /deep/ .el-button {
    width: 100%;
    margin-top: 35px;
  }

  /deep/ .el-checkbox {
    margin-right: 160px;
  }
</style>
