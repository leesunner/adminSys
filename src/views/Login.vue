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
      <transition name="fade" mode="out-in" appear>
        <component :is="loginType"></component>
      </transition>
    </div>
  </div>
</template>

<script>
  const infoLogin = () => import('../components/login/infoLogin')
  const phoneLogin = () => import('../components/login/phoneLogin')
  export default {
    components: {infoLogin, phoneLogin},
    name: "login",
    data() {
      return {
        height: window.innerHeight,
        activeName: 'first',
        loginType: 'infoLogin',
      }
    },
    methods: {
      handleClick({name}) {
        name == 'first' ? this.loginType = 'infoLogin' : this.loginType = 'phoneLogin'
      },
    }
  }
</script>

<style lang="scss" scoped>
  .particles {
    background: url("~@img/1624043_12B.jpg") no-repeat;
    background-size: 100% 100%;
    position: relative;
  }

  .login-mode {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 515px;
    width: 410px;
    padding: 10px 30px;
    background-color: rgba(255, 255, 255, 0.98);
    user-select: none;
    color: #fff;
    overflow: hidden;
    h1 {
      padding: 20px 0;
      font-size: 20px;
      margin-bottom: 10px;
      color: #303133;
    }
  }
</style>
