<template>
    <div class="par-box" :class="$attrs.class">
      <div class="par-box-l-top"></div>
      <div class="par-box-l-bottom"></div>
      <div class="par-box-r-top"></div>
      <div class="par-box-r-bottom"></div>
      <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "item-box"
    }
</script>

<style lang="scss" scoped>
.par-box{
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  /*border: solid 1px rgba(65,162,255,.3);*/
  /*.boxsize{*/
    /*width: 8px;*/
    /*height: 8px;*/
  /*}*/
  &-l-top{
    position: absolute;
    top: 0;
    left: 0;
    width: 131px;
    height: 70px;
    background-image: url("../../../assets/img/lefttop.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  &-l-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 122px;
    height: 60px;
    background-image: url("../../../assets/img/leftbottom.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  &-r-bottom{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 191px;
    height: 75px;
    background-image: url("../../../assets/img/rightbottom.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  &-r-top{
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 55px;
    background-image: url("../../../assets/img/righttop.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
