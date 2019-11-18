<template>
  <div id="login">
    <vue-particles
      color="#dedede"
      :height="`${height}px`"
      :particleOpacity="0.65"
      :particlesNumber="130"
      shapeType="circle"
      :particleSize="3"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.45"
      :linesDistance="110"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="particles"
    >
    </vue-particles>
    <div class="login-mode">
        <h1>百问数字政务系统</h1>
      <el-tabs v-model="activeName" ref="tabs" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="密码登录" name="first"></el-tab-pane>
        <el-tab-pane label="手机登录" name="second"></el-tab-pane>
      </el-tabs>
      <el-form  ref="form" :model="data">
        <el-form-item>
          <el-form-item label="用户名：">
            <el-input v-model="data.name" class="trans" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="data.name" class="trans" clearable></el-input>
          </el-form-item>
          <slider></slider>
          <el-form-item>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
            <el-link v-power="''">忘记密码？</el-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="abc" @click="login">登 录</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Slider from '../components/checking/slider'
  export default {
    components: {Slider},
    name: "login",
    comments:{Slider},
    data() {
      return {
        height: window.innerHeight,
        data:{
          username:'',
          password:''
        },
        checked:'',
        activeName:'first',
      }
    },
    methods:{
      handleClick(){

      },
      login(){
        this.$store.dispatch('routerTree').then(res=>{
          this.$router.push('index')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .particles {
    background: url("~@img/1624043_12B.jpg") no-repeat;
    background-size: 100% 100%;
    position: relative;
  }
  .login-mode{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 515px;
    width: 410px;
    padding: 10px 30px;
    background-color: rgba(0,0,0,0.4);
    user-select: none;
    color: #fff;
    h1{
      padding: 20px 0;
      font-size: 20px;
      margin-bottom: 10px;
    }
    .trans{
      & /deep/.el-input__inner{
        background-color: $opcity;
      }
    }
    & /deep/.el-button{
      width: 100%;
      margin-top: 35px;
    }
    & /deep/.el-checkbox{
      margin-right: 160px;
    }
  }
</style>
