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

  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        height: window.innerHeight,
        data:{
          username:'',
          password:'',
        }
      }
    },
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
    width: 388px;
    height: 560px;
    padding: 10px 10px;
    background-color: $black;
    h1{
      color: $black;
    }
  }
</style>
