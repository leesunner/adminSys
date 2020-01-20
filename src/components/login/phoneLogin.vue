<template>
  <el-form ref="form" :model="data">
      <el-form-item>
        <div class="inputContent">
          <lee-icon icon="iconshouji"></lee-icon>
          <el-input v-model="data.telephone" placeholder="请输入手机号" class="trans" clearable></el-input>
        </div>
      </el-form-item>
      <!--<div class="code">-->
      <!--<div>-->
      <!--<el-form-item label="验证码：">-->
      <!--<el-input v-model="data.code" class="trans" clearable></el-input>-->
      <!--</el-form-item>-->
      <!--</div>-->
      <!--<jGraph contentWidth="100" contentHeight="40"></jGraph>-->
      <!--</div>-->
      <div class="code">
        <div class="code-input">
          <el-form-item>
            <el-input type="password" v-model="data.verificationCode" placeholder="请输入验证码" clearable></el-input>
          </el-form-item>
        </div>
        <el-button :type="buttonType" size="small" class="code-send" @click="sendCode">{{codeText>0?`${codeText}
          S`:codeText}}
        </el-button>
      </div>
      <el-form-item>
        <el-button type="primary" class="login" @click="login" @keyup.enter.native="login">登 录</el-button>
      </el-form-item>
  </el-form>
</template>

<script>
  // const Slider = () => import('../checking/slider')
  const jGraph = () => import('../checking/jGraphicCode')
  import {Encrypt} from '@/tools/utilTools'

  const leeIcon = () => import('@/components/icon/index')
  export default {
    name: "phone-login",
    components: {
      jGraph,
      leeIcon
    },
    data() {
      return {
        checked: '',
        data: {
          telephone: '',
          verificationCode: ''
        },
        codeText: '发送验证码',
        time: null,
        buttonType: 'primary'
      }
    },
    beforeDestroy() {
      clearTimeout(this.time)
      this.time = null
      this.codeText = '发送验证码'
    },
    methods: {
      //发送验证码
      sendCode() {
        if (this._funs.checkPhone(this.data.telephone)){
          if (this.codeText === '发送验证码') {
            //发送验证码的接口
            this.$request.get(`${this.$apiList.sendCode}/${this.data.telephone}`).then(res=>{
              this.buttonType = 'info'
              this.codeText = 59
              this.countDown()
            })
          } else {
            this.$message({
              message: `请${this.codeText}秒再试`,
              type: 'warning'
            });
          }
        }else{
          this.$message.error('请输入正确的手机号码')
        }
      },
      //倒计时
      countDown() {
        this.time = setTimeout(() => {
          this.codeText--
          if (this.codeText === 0) {
            this.codeText = '发送验证码'
            this.buttonType = 'primary'
          } else {
            this.countDown()
          }
        }, 1000)
      },
      //验证表单信息
      checkInfo() {
        if (!this._funs.checkPhone(this.data.telephone)){
          this.$message.error('请输入正确的手机号码')
          return false
        }
        if(!this.data.verificationCode){
          this.$message.error('请输入验证码')
          return false
        }
        return true
      },
      //登录
      login() {
        if (this.checkInfo()) {
          this.$store.dispatch('LoginByPhone', this.data).then(res => {
            this.$router.push('/index')
          })
        }
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

  /deep/ .el-button {
    margin-top: 35px;
    width: 100%;
  }

  /deep/ .el-checkbox {
    margin-right: 160px;
  }

  .code {
    position: relative;
    margin-top: 15px;
    &-input {
      width: 55%;
    }
    &-send {
      position: absolute;
      height: 40px;
      right: 5px;
      bottom: 0;
      width: 100px !important;
    }
  }
</style>
